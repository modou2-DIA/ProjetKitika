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
    public ReservationGroupee getById(@PathVariable int id) {
        return reservationGroupeeService.getById(id);
    }
}
