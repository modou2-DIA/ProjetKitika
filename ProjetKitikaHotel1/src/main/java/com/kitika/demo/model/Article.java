package com.kitika.demo.model;


import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
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
public class Article { 
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String type; // Exemple : Boisson, Repas,petit-dej etc.

   private String nom;

   private int quantite;
   
    private float prixUnitaire;

    @ManyToOne
    @JoinColumn(name = "consommation_id")
    @JsonIgnore // Ignorer lors de la sérialisation pour éviter les boucles infinies
    private Consommation consommation;

    

    

  
    
  


    

}
