package com.kitika.demo.model;

import java.time.LocalDate;

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
public class ExtraCharge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // Ex: "Room service", "Spa", "Laundry"
    private String description;
    private double montant;

    @ManyToOne
    @JoinColumn(name = "reservation_id")
    private Reservation reservation;

    private LocalDate dateCharge;
}
