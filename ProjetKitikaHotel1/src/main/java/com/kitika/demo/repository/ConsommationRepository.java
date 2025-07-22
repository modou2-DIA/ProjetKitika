package com.kitika.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kitika.demo.model.Consommation;

import java.time.LocalDate;
import java.util.List;

public interface ConsommationRepository extends JpaRepository<Consommation, Integer> {

    List<Consommation> findByClientId(int clientId);

    //List<Consommation> findByChambreId(int chambreId);

    List<Consommation> findByDateBetween(LocalDate start, LocalDate end);
}
