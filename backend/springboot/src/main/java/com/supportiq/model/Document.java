package com.supportiq.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String filename;

    @Column(nullable = false)
    private String tenantId;

    @Column(nullable = false)
    private String filePath;

    @Column(nullable = false)
    private String status = "PROCESSING";

    @Column
    private LocalDateTime uploadedAt = LocalDateTime.now();

    @Column
    private LocalDateTime indexedAt;
}
