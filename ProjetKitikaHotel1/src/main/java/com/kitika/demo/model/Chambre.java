package com.kitika.demo.model;


import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

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

    @Column(nullable = false, unique = true)
    private String numero;
    @Column(nullable = false)
    private String type;
    private String statut; // "libre" ou "réservée"
    @Column(nullable = false)
    private float prixParNuit; 
    private boolean horsService ;  
    
    @OneToMany(mappedBy = "chambre")
    @JsonIgnore
    private List<Reservation> reservations;


   
}
