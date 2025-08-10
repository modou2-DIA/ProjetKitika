package com.kitika.demo.model;


import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;

import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter 
@AllArgsConstructor
@NoArgsConstructor
public class FicheClient { 
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private int id;
        private String note ; 
        private LocalDate checkin;
        private LocalDate checkout;
	    
    private String statut; // En cours, Terminé, Annulé...

	 @OneToOne
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;


}
