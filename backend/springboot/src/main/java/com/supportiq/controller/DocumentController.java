package com.supportiq.controller;

import com.supportiq.dto.Dtos.*;
import com.supportiq.security.JwtUtil;
import com.supportiq.service.DocumentService;
import com.supportiq.service.RateLimiterService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/docs")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;
    private final RateLimiterService rateLimiterService;
    private final JwtUtil jwtUtil;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request) {
        try {
            String tenantId = extractTenantId(request);

            // Rate limiting — max 20 uploads per hour per tenant
            if (!rateLimiterService.isAllowed(tenantId, "upload")) {
                return ResponseEntity.status(429)
                        .body(Map.of("error", "Upload rate limit exceeded. Max 20 uploads per hour."));
            }

            DocumentResponse doc = documentService.uploadDocument(file, tenantId);
            return ResponseEntity.ok(doc);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/list")
    public ResponseEntity<List<DocumentResponse>> getDocuments(HttpServletRequest request) {
        String tenantId = extractTenantId(request);
        return ResponseEntity.ok(documentService.getDocuments(tenantId));
    }

    @GetMapping("/status/{docId}")
    public ResponseEntity<?> getDocumentStatus(
            @PathVariable String docId,
            HttpServletRequest request) {
        String tenantId = extractTenantId(request);
        return ResponseEntity.ok(documentService.getDocumentStatus(docId, tenantId));
    }

    @GetMapping("/ready")
    public ResponseEntity<?> checkDocsReady(HttpServletRequest request) {
        // Check if all docs for this tenant are ready
        String tenantId = extractTenantId(request);
        List<DocumentResponse> docs = documentService.getDocuments(tenantId);

        boolean allReady = docs.stream().allMatch(d -> "READY".equals(d.getStatus()));
        long readyCount = docs.stream().filter(d -> "READY".equals(d.getStatus())).count();
        long processingCount = docs.stream().filter(d -> "PROCESSING".equals(d.getStatus())).count();

        return ResponseEntity.ok(Map.of(
                "allReady", allReady,
                "totalDocs", docs.size(),
                "readyCount", readyCount,
                "processingCount", processingCount
        ));
    }

    @DeleteMapping("/{docId}")
    public ResponseEntity<?> deleteDocument(
            @PathVariable String docId,
            HttpServletRequest request) {
        try {
            String tenantId = extractTenantId(request);
            documentService.deleteDocument(docId, tenantId);
            return ResponseEntity.ok(Map.of("message", "Document deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private String extractTenantId(HttpServletRequest request) {
        if (request.getCookies() == null) throw new RuntimeException("No cookies found");
        return Arrays.stream(request.getCookies())
                .filter(c -> "jwt".equals(c.getName()))
                .map(c -> jwtUtil.extractTenantId(c.getValue()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("TenantId not found"));
    }
}
