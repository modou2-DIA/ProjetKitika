package com.kitika.demo.controller;

import com.kitika.demo.model.ExtraCharge;
import com.kitika.demo.service.ExtraChargeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/extra-charges")
public class ExtraChargeController {
    @Autowired
    private ExtraChargeService extraChargeService;

    @PostMapping("/{reservationId}")
    public ResponseEntity<ExtraCharge> addCharge(@PathVariable("reservationId") int reservationId,
                                                 @RequestBody ExtraCharge charge) {
        return ResponseEntity.ok(extraChargeService.addExtraCharge(reservationId, charge));
    }

    @GetMapping("/{reservationId}")
    public ResponseEntity<List<ExtraCharge>> getCharges(@PathVariable("reservationId") Long reservationId) {
        return ResponseEntity.ok(extraChargeService.getChargesByReservation(reservationId));
    }
}
