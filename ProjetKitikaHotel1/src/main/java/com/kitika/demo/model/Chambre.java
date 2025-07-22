package com.kitika.demo.model;


import java.util.List;

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
public class Chambre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String numero;
    private String type;
    private String statut; // "libre" ou "réservée"
    private float prixParNuit; 
    private boolean horsService ;  
    
    @OneToMany(mappedBy = "chambre")
    private List<Reservation> reservations;


   
}
