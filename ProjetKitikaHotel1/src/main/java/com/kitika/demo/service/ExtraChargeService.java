package com.kitika.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.kitika.demo.model.ExtraCharge;
import com.kitika.demo.model.Reservation;
import com.kitika.demo.repository.ExtraChargeRepository;

import java.time.LocalDate;
import java.util.List;

@Service
public class ExtraChargeService {
    @Autowired
    private ExtraChargeRepository extraChargeRepository;

    public ExtraCharge addExtraCharge(int reservationId, ExtraCharge charge) {
        Reservation res = new Reservation();  
        res.setId(reservationId);
        // Associer la charge à la réservation
        charge.setReservation(res);
        charge.setDateCharge(LocalDate.now());
        return extraChargeRepository.save(charge);
    }

    public List<ExtraCharge> getChargesByReservation(Long reservationId) {
        return extraChargeRepository.findByReservationId(reservationId);
    }
}
