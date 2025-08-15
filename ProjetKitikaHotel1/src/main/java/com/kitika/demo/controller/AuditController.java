package com.kitika.demo.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kitika.demo.model.AuditLog;
import com.kitika.demo.service.AuditService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/audit")
public class AuditController {

    @Autowired
    private AuditService auditService;

    @GetMapping
    public Page<AuditLog> search(
            @RequestParam(required = false,value="from") String from,
            @RequestParam(required = false,value="to") String to,
            @RequestParam(required = false,value="action") String action,
            @RequestParam(required = false,value="tablename") String tableName,
            @RequestParam(required = false,value="utilisateur") String utilisateur,
            @RequestParam(defaultValue = "0",value="page") int page,
            @RequestParam(defaultValue = "20",value="size") int size,
            @RequestParam(defaultValue = "dateHeure",value="sortBy") String sortBy,
            @RequestParam(defaultValue = "DESC",value="dir") String dir ) {
        LocalDateTime fromDt = (from == null || from.isEmpty()) ? LocalDateTime.of(1970,1,1,0,0) : LocalDate.parse(from).atStartOfDay();
        LocalDateTime toDt = (to == null || to.isEmpty()) ? LocalDateTime.now().plusDays(1) : LocalDate.parse(to).atTime(23,59,59);
        return auditService.search(fromDt, toDt, action, tableName, utilisateur, page, size, sortBy, dir);
    }
}
