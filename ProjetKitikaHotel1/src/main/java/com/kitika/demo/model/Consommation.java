package com.kitika.demo.model;

import java.time.LocalDate;

import jakarta.persistence.*;
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

    private String type; // Exemple : Boisson, Repas, etc.

    private String description;

    private float montant;

    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "fiche_id")
    private FicheClient client;
    
    @ManyToOne
    @JoinColumn(name = "produit_id")
    private Produit produit;


    

}
