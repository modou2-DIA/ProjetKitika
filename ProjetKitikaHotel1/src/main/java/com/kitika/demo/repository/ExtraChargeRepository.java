package com.kitika.demo.repository;

import com.kitika.demo.model.ExtraCharge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExtraChargeRepository extends JpaRepository<ExtraCharge, Long> {
    List<ExtraCharge> findByReservationId(Long reservationId);
}
