package com.kitika.demo.controller;

import com.kitika.demo.model.Consommation;
import com.kitika.demo.service.IConsommationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/consommations")
public class ConsommationController {

    @Autowired
    private IConsommationService consommationService;

    @GetMapping
    public List<Consommation> getAllConsommations() {
        return consommationService.getAllConsommations();
    }

    @GetMapping("/{id}")
    public Consommation getConsommationById(@PathVariable int id) {
        return consommationService.getConsommationById(id);
    }

    @PostMapping
    public Consommation createConsommation(@RequestBody Consommation consommation) {
        return consommationService.saveConsommation(consommation);
    }

    @PutMapping("/{id}")
    public Consommation updateConsommation(@PathVariable int id, @RequestBody Consommation consommation) {
        consommation.setId(id);
        return consommationService.saveConsommation(consommation);
    }

    @DeleteMapping("/{id}")
    public void deleteConsommation(@PathVariable int id) {
        consommationService.deleteConsommation(id);
    }

    @GetMapping("/client/{clientId}")
    public List<Consommation> getByClient(@PathVariable int clientId) {
        return consommationService.getByClient(clientId);
    }

    /*@GetMapping("/chambre/{chambreId}")
    public List<Consommation> getByChambre(@PathVariable int chambreId) {
        return consommationService.getByChambre(chambreId);
    }*/

    @GetMapping("/periode")
    public List<Consommation> getByDates(@RequestParam String start, @RequestParam String end) {
        return consommationService.getByDateRange(LocalDate.parse(start), LocalDate.parse(end));
    }
}
