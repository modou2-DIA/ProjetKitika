package com.kitika.demo.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.kitika.demo.model.AuditLog;
import com.kitika.demo.repository.AuditLogRepository;

@Service
public class AuditService {
    @Autowired
    private AuditLogRepository repo;

    public AuditLog save(String action, String tableName, String recordId, String utilisateur, String details) {
        AuditLog log = AuditLog.builder()
                .action(action)
                .tableName(tableName)
                .recordId(recordId)
                .utilisateur(utilisateur)
                .dateHeure(LocalDateTime.now())
                .details(details)
                .build();
        return repo.save(log);
    }

    public Page<AuditLog> search(LocalDateTime from, LocalDateTime to, String action, String tableName, String utilisateur, int page, int size, String sortBy, String dir) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(dir), sortBy));
        return repo.findByDateHeureBetweenAndActionContainingIgnoreCaseAndTableNameContainingIgnoreCaseAndUtilisateurContainingIgnoreCase(
                from, to, action == null ? "" : action, tableName == null ? "" : tableName, utilisateur == null ? "" : utilisateur, pageable);
    }
}
