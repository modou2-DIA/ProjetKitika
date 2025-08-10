package com.kitika.demo.dto;

import java.time.LocalDate;



import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AllArgsConstructor;

@Getter
@Setter 
@AllArgsConstructor
@NoArgsConstructor
public class ReservationAvecClientDTO {
    private int chambreId;

    private String nom;
    private String prenom;
    private String telephone;
    private String email;
    private String nationalite;
    private String numeroPieceIdentite;

    private LocalDate dateDebut;
    private LocalDate dateFin;
}
