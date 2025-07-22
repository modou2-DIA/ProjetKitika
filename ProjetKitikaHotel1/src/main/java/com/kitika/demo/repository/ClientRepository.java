package com.kitika.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kitika.demo.model.Client;

public interface ClientRepository extends JpaRepository<Client, Integer> {
    // Tu peux ajouter ici des méthodes de recherche personnalisées plus tard (par nom, email...)
}
