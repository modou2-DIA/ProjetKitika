package com.kitika.demo.model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
public class Client {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String nom;
    private String prenom;
    private String telephone;
    private String email;
    private String societe;
    private String adresse;
    private String nationalite;
    private String numeroPieceIdentite; 
    
    @OneToMany(mappedBy = "client")
    private List<Reservation> reservations; 
    
    @OneToMany(mappedBy = "client")
    private List<Facture> factures;


}
