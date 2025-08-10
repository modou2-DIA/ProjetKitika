package com.kitika.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kitika.demo.dto.ReservationAvecClientDTO;
import com.kitika.demo.model.Reservation;
import com.kitika.demo.service.ConfirmationPdfService;
import com.kitika.demo.service.EmailService;
import com.kitika.demo.service.IReservationService;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private IReservationService reservationService;
    @Autowired
    private ConfirmationPdfService pdfService;

    @Autowired
    private EmailService emailService;

    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationService.getAllReservations();
    }

    @GetMapping("/{id}")
    public Reservation getReservationById(@PathVariable int id) {
        return reservationService.getReservationById(id);
    }

    @PostMapping
    public Reservation createReservation(@RequestBody Reservation reservation) {
        return reservationService.saveReservation(reservation);
    }

    @PutMapping("/{id}")
    public Reservation updateReservation(@PathVariable("id") int id, @RequestBody Reservation reservation) {
        reservation.setId(id);
        return reservationService.saveReservation(reservation);
    }

    @DeleteMapping("/{id}")
    public void deleteReservation(@PathVariable("id") int id) {
        reservationService.deleteReservation(id);
    }
    @PostMapping("/avec-client")
    public ResponseEntity<?> reserverAvecClient(@RequestBody ReservationAvecClientDTO dto) {
        try {
            Reservation reservation = reservationService.creerReservationAvecClient(dto);
            return ResponseEntity.ok(reservation);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

 

    @PostMapping("/{id}/envoyer-confirmation")
    public ResponseEntity<String> envoyerConfirmation(@PathVariable("id") int id) {
        Reservation res = reservationService.getReservationById(id);
        if (res == null) {
            return ResponseEntity.notFound().build();
        }

        byte[] pdfBytes = pdfService.generateReservationConfirmation(res);

        emailService.sendEmailWithAttachment(
                res.getClient().getEmail(),
                "Confirmation de votre réservation",
                "Bonjour " + res.getClient().getNom() + ",\n\nVeuillez trouver ci-joint la confirmation de votre réservation.",
                pdfBytes,
                "confirmation_reservation.pdf"
        );

        return ResponseEntity.ok("Confirmation envoyée avec succès");
    }



}
