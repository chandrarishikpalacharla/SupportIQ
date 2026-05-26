package com.supportiq.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.supportiq.dto.Dtos.DocumentStatusUpdate;
import com.supportiq.model.Document;
import com.supportiq.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class KafkaConsumer {

    private final DocumentRepository documentRepository;
    private final ObjectMapper objectMapper;

    // Listens for status updates from FastAPI after indexing is done
    @KafkaListener(topics = "doc-status", groupId = "springboot-group")
    public void consumeDocStatusUpdate(String message) {
        try {
            DocumentStatusUpdate update = objectMapper.readValue(message, DocumentStatusUpdate.class);
            log.info("Received doc status update: {} -> {}", update.getDocumentId(), update.getStatus());

            Optional<Document> docOpt = documentRepository.findById(update.getDocumentId());
            if (docOpt.isPresent()) {
                Document doc = docOpt.get();
                doc.setStatus(update.getStatus());
                if ("READY".equals(update.getStatus())) {
                    doc.setIndexedAt(LocalDateTime.now());
                }
                documentRepository.save(doc);
                log.info("Updated doc {} status to {}", update.getDocumentId(), update.getStatus());
            }
        } catch (Exception e) {
            log.error("Failed to process doc status update", e);
        }
    }
}
