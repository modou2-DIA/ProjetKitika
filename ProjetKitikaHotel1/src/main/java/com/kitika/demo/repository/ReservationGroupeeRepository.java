package com.kitika.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.kitika.demo.model.ReservationGroupee;

public interface ReservationGroupeeRepository extends JpaRepository<ReservationGroupee, Integer> {
}
