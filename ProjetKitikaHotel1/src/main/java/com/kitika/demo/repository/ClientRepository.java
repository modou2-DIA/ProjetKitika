package com.kitika.demo.repository;

import com.kitika.demo.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<Client, Integer> {

    // Récupération par type (particulier ou société)
    List<Client> findByType(String type);

    // Recherche flexible
    @Query("SELECT c FROM Client c " +
           "WHERE (:nom IS NULL OR LOWER(c.nom) LIKE LOWER(CONCAT('%', :nom, '%'))) " +
           "AND (:prenom IS NULL OR LOWER(c.prenom) LIKE LOWER(CONCAT('%', :prenom, '%'))) " +
           "AND (:entite IS NULL OR LOWER(c.type) LIKE LOWER(CONCAT('%', :entite, '%')))")
    List<Client> searchClients(@Param("nom") String nom,
                               @Param("prenom") String prenom,
                               @Param("entite") String entite);
}
