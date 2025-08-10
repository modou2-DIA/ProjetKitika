package com.kitika.demo.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
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
    @Column(nullable = false)
    private String nom;
    private String prenom;
    @Column(nullable = false, unique = true)
    private String telephone;
    @Column(nullable = false, unique = true)
    private String email;
    private String societe;
    private String adresse; 

    
    private String type; // "particulier" ou "societe"
    private String nationalite;
    private String numeroPieceIdentite; 
    
    @OneToMany(mappedBy = "client")
    @JsonIgnore
    private List<Reservation> reservations; 
    
    @OneToMany(mappedBy = "client")
    @JsonIgnore
    private List<Facture> factures;


}
