package com.supportiq.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {

    @Bean
    public NewTopic docUploadTopic() {
        return TopicBuilder.name("doc-upload")
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic docStatusTopic() {
        return TopicBuilder.name("doc-status")
                .partitions(3)
                .replicas(1)
                .build();
    }
}
