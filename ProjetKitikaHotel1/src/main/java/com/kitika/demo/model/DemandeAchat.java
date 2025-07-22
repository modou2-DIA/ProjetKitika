package com.kitika.demo.model;


import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter 
@AllArgsConstructor
@NoArgsConstructor
public class DemandeAchat { 
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private LocalDate dateDemande;

    private String statut; // Exemple : "En attente", "Validée", "Refusée"

    private String commentaire;

    @ManyToMany
    private List<Produit> produits;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Utilisateur demandeur; // Celui qui a fait la demande

    private int quantite;


}
