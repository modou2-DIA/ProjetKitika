package com.kitika.demo.model;


import java.time.LocalDate;
import java.util.List;



import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
public class Facture { 
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private LocalDate dateEmission;

    private float montantTotal;

    @ManyToOne
    @JoinColumn(name = "client_id") 
    private Client client;

    @OneToMany
    private List<Consommation> consommations; // Liées à la facture

    
    private boolean payee; 
    @OneToOne
    @JoinColumn(name = "groupe_id")
    private ReservationGroupee reservationGroupee; 

     @OneToOne
    @JoinColumn(name = "reservation_id")
   
    private Reservation  reservation;



}
