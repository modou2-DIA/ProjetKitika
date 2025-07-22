package com.kitika.demo.model;

import java.time.LocalDate;


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
public class Reservation {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id ;  
	private LocalDate dateDebut;
    private LocalDate dateFin;
    private String statut;
    private float total;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;


    @ManyToOne 
    @JoinColumn(name = "chambre_id")
    private Chambre chambre; 
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private Utilisateur receptionniste; // Celui qui a fait la reservation
}
