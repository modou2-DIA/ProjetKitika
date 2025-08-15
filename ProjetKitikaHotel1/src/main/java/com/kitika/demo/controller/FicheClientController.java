package com.kitika.demo.controller;

import com.kitika.demo.model.FicheClient;
import com.kitika.demo.service.IFicheClientService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/fiches-client")
public class FicheClientController {

    @Autowired
    private IFicheClientService ficheClientService;

    @GetMapping
    public List<FicheClient> getAllFiches() {
        return ficheClientService.getAllFiches();
    }

    @GetMapping("/{id}")
    public FicheClient getFicheById(@PathVariable("id") int id) {
        return ficheClientService.getFicheById(id);
    }

    @GetMapping("/reservation/{reservationId}")
    public FicheClient getFicheByReservationId(@PathVariable("reservationId") int reservationId) {
        return ficheClientService.getFicheByReservationId(reservationId);
    }

    @PostMapping
    public FicheClient createFiche(@RequestBody FicheClient ficheClient) {
        return ficheClientService.saveFiche(ficheClient);
    }

    @PutMapping("/{id}")
    public FicheClient updateFiche(@PathVariable("id") int id, @RequestBody FicheClient ficheClient) {
        ficheClient.setId(id);
        return ficheClientService.saveFiche(ficheClient);
    }

    @DeleteMapping("/{id}")
    public void deleteFiche(@PathVariable("id") int id) {
        ficheClientService.deleteFiche(id);
    } 
    @PostMapping("/checkin/{reservationId}")
    public ResponseEntity<?> creerFicheDepuisReservation(@PathVariable("reservationId") int reservationId) {
        try {
            ficheClientService.creerDepuisReservation(reservationId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur : " + e.getMessage());
        }
    } 
    @PutMapping("/checkout/{reservationId}")
    public ResponseEntity<?> effectuerCheckout(@PathVariable("reservationId") int reservationId) {
    try {
        ficheClientService.effectuerCheckout(reservationId);
        return ResponseEntity.ok("Check-out effectué avec succès");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors du check-out");
    }
       }


}
