package com.supportiq.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

public class Dtos {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        private String email;
        private String password;
        private String tenantId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserResponse {
        private String id;
        private String email;
        private String tenantId;
        private String role;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginResponse {
        private UserResponse user;
        private String tenantId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DocumentResponse {
        private String id;
        private String filename;
        private String status;
        private String tenantId;
        private String uploadedAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DocumentStatusUpdate {
        private String documentId;
        private String status;
        private String tenantId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class KafkaUploadEvent {
        private String documentId;
        private String tenantId;
        private String filePath;
        private String filename;
    }
}
