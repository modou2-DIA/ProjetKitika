package com.kitika.demo.dto;

import java.time.LocalDate;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReservationGuestDTO {
    private int reservationId;
    private Integer clientId;
    private String clientNom;
    private String clientPrenom;
    private String clientTelephone;
    private String chambreNumero;
    private String chambreType;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String statut;

    // getters / setters

}
