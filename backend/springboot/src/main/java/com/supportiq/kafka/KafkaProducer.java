package com.supportiq.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.supportiq.dto.Dtos.KafkaUploadEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class KafkaProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public void publishDocUploadEvent(KafkaUploadEvent event) {
        try {
            String message = objectMapper.writeValueAsString(event);
            kafkaTemplate.send("doc-upload", event.getTenantId(), message);
            log.info("Published doc upload event for doc: {}", event.getDocumentId());
        } catch (Exception e) {
            log.error("Failed to publish doc upload event", e);
        }
    }
}
