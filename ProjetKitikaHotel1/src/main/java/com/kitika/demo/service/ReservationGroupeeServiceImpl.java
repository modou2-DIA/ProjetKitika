package com.kitika.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kitika.demo.model.ReservationGroupee;
import com.kitika.demo.repository.ReservationGroupeeRepository;

@Service
public class ReservationGroupeeServiceImpl implements ReservationGroupeeService {

    @Autowired
    private ReservationGroupeeRepository reservationGroupeeRepository;

    @Override
    public ReservationGroupee create(ReservationGroupee reservationGroupee) {
        return reservationGroupeeRepository.save(reservationGroupee);
    }

    @Override
    public List<ReservationGroupee> getAll() {
        return reservationGroupeeRepository.findAll();
    }

    @Override
    public ReservationGroupee getById(int id) {
        return reservationGroupeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ReservationGroupee non trouvée avec ID : " + id));
    }
}
