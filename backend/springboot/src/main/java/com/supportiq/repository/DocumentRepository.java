package com.supportiq.repository;

import com.supportiq.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface DocumentRepository extends JpaRepository<Document, String> {
    List<Document> findByTenantId(String tenantId);
    Optional<Document> findByIdAndTenantId(String id, String tenantId);

    @Transactional
    @Modifying
    @Query("DELETE FROM Document d WHERE d.id = :id AND d.tenantId = :tenantId")
    void deleteByIdAndTenantId(String id, String tenantId);
}
