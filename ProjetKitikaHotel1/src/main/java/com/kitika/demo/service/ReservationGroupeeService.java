package com.kitika.demo.service;

import java.util.List;

import com.kitika.demo.model.ReservationGroupee;

public interface ReservationGroupeeService {
    ReservationGroupee create(ReservationGroupee reservationGroupee);
    List<ReservationGroupee> getAll();
    ReservationGroupee getById(int id);
}
