package com.supportiq.service;

import com.supportiq.dto.Dtos.*;
import com.supportiq.kafka.KafkaProducer;
import com.supportiq.model.Document;
import com.supportiq.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final KafkaProducer kafkaProducer;

    private static final String UPLOAD_DIR = "/app/uploads/";

    public DocumentResponse uploadDocument(MultipartFile file, String tenantId) throws IOException {
        // Create upload directory if not exists
        Path uploadPath = Paths.get(UPLOAD_DIR + tenantId);
        Files.createDirectories(uploadPath);

        // Save file to disk
        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);
        file.transferTo(filePath.toFile());

        // Save document record in DB with PROCESSING status
        Document document = new Document();
        document.setFilename(file.getOriginalFilename());
        document.setTenantId(tenantId);
        document.setFilePath(filePath.toString());
        document.setStatus("PROCESSING");
        Document saved = documentRepository.save(document);

        // Publish to Kafka — FastAPI will pick this up and index it
        KafkaUploadEvent event = new KafkaUploadEvent(
                saved.getId(),
                tenantId,
                filePath.toString(),
                file.getOriginalFilename()
        );
        kafkaProducer.publishDocUploadEvent(event);

        log.info("Document uploaded and event published: {}", saved.getId());

        return toResponse(saved);
    }

    public List<DocumentResponse> getDocuments(String tenantId) {
        return documentRepository.findByTenantId(tenantId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public DocumentResponse getDocumentStatus(String docId, String tenantId) {
        Document doc = documentRepository.findByIdAndTenantId(docId, tenantId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        return toResponse(doc);
    }

    public void deleteDocument(String docId, String tenantId) {
        Document doc = documentRepository.findByIdAndTenantId(docId, tenantId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        // Delete file from disk
        try {
            Files.deleteIfExists(Paths.get(doc.getFilePath()));
        } catch (IOException e) {
            log.warn("Could not delete file: {}", doc.getFilePath());
        }

        documentRepository.deleteByIdAndTenantId(docId, tenantId);
        log.info("Document deleted: {}", docId);
    }

    private DocumentResponse toResponse(Document doc) {
        return new DocumentResponse(
                doc.getId(),
                doc.getFilename(),
                doc.getStatus(),
                doc.getTenantId(),
                doc.getUploadedAt().toString()
        );
    }
}
