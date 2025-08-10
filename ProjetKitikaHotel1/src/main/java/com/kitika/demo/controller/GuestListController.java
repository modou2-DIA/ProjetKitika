package com.kitika.demo.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kitika.demo.dto.GuestListResponse;
import com.kitika.demo.model.Reservation;
import com.kitika.demo.service.GuestListService;
import com.kitika.demo.service.IReservationService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/guest-list")
public class GuestListController {

    @Autowired
    private GuestListService guestListService;
    @Autowired
    private IReservationService reservationService;

    @GetMapping
    public GuestListResponse getGuestList(
        @RequestParam(name = "date", required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        if (date == null) date = LocalDate.now();
        return guestListService.getGuestList(date);
    }
    @GetMapping("/search")
    public List<Reservation> searchGuestList(
            @RequestParam(value="nom" ,required = false) String nom,
            @RequestParam(value="prenom" ,required = false) String prenom,
            @RequestParam(value="entite",required = false) String entite) {
        return reservationService.searchGuestList(nom, prenom, entite);
    }
}
