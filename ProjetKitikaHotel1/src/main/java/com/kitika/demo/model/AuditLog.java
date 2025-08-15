package com.kitika.demo.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "audit_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String action;       // CREATE / UPDATE / DELETE / CHECKIN / CHECKOUT / GENERER_FACTURE / etc.
    private String tableName;    // ex: Reservation, Facture, Produit...
    private String recordId;     // id de l'enregistrement (string pour flexibilité)
    private String utilisateur;  // login / nom utilisateur (ou "SYSTEM")
    private LocalDateTime dateHeure;

    @Column(columnDefinition = "TEXT")
    private String details;      // JSON ou message libre contenant ancienne / nouvelle valeur, message d'erreur, payload...
}
