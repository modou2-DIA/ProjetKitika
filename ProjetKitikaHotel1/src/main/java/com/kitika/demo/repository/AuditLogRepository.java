package com.kitika.demo.repository;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.kitika.demo.model.AuditLog;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    Page<AuditLog> findByDateHeureBetweenAndActionContainingIgnoreCaseAndTableNameContainingIgnoreCaseAndUtilisateurContainingIgnoreCase(
            LocalDateTime from, LocalDateTime to, String action, String tableName, String utilisateur, Pageable pageable);
}
