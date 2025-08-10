package com.kitika.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.kitika.demo.model.ReservationGroupee;
import com.kitika.demo.service.ReservationGroupeeService;

@RestController
@RequestMapping("/api/reservations-groupees")
@CrossOrigin(origins = "*")
public class ReservationGroupeeController {

    @Autowired
    private ReservationGroupeeService reservationGroupeeService;

    @PostMapping
    public ReservationGroupee create(@RequestBody ReservationGroupee reservationGroupee) {
        return reservationGroupeeService.create(reservationGroupee);
    }

    @GetMapping
    public List<ReservationGroupee> getAll() {
        return reservationGroupeeService.getAll();
    }

    @GetMapping("/{id}")
    public ReservationGroupee getById(@PathVariable("id") int id) {
        return reservationGroupeeService.getById(id);
    }

    /**
     * Ajoute une réservation à une réservation groupée existante.
     * URL: PUT /api/reservations-groupees/{reservationGroupeeId}/reservations/{reservationId}
     * @param reservationGroupeeId L'ID de la réservation groupée.
     * @param reservationId L'ID de la réservation à ajouter.
     * @return La réservation groupée mise à jour.
     */
    @PutMapping("/{reservationGroupeeId}/reservations/{reservationId}")
    public ReservationGroupee addReservation(@PathVariable("reservationGroupeeId") int reservationGroupeeId, @PathVariable("reservationId") int reservationId) {
        return reservationGroupeeService.addReservationToGroup(reservationGroupeeId, reservationId);
    }
}
