package com.kitika.demo.model;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter 
@AllArgsConstructor
@NoArgsConstructor
public class Consommation { 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String type; // Exemple : Restauration, Mini-bar
    
    private String description; // Par exemple : "Déjeuner du 12/08/2025"
    
    private float montantTotal; // Le montant total de tous les articles de cette consommation

    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "fiche_id")
    @JsonIgnore
    private FicheClient client;
    
    // Relation OneToMany vers Article
    // Une consommation peut avoir plusieurs articles
    @OneToMany(mappedBy = "consommation")
    private List<Article> articles;
}
