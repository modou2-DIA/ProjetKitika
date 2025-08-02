package com.kitika.demo.model;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.CascadeType;
import java.util.List;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReservationGroupee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String nomGroupe; // e.g. "Séminaire Orange 2025"
    private LocalDate dateDebut;
    private LocalDate dateFin;

    @ManyToOne
    private Client societe; // client principal (société)

    @OneToMany(mappedBy = "reservationGroupee", cascade = CascadeType.ALL)
    private List<Reservation> reservations;

    @OneToOne(mappedBy = "reservationGroupee", cascade = CascadeType.ALL)
    private Facture facture;
}
