package com.kitika.demo.controller;

import com.kitika.demo.model.Utilisateur;
import com.kitika.demo.service.IUtilisateurService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
public class UtilisateurController {

    @Autowired
    private IUtilisateurService utilisateurService;

    @GetMapping("/")
    public List<Utilisateur> getAll() {
        return utilisateurService.findAll();
    }

    @PostMapping("/")
    public Utilisateur save(@RequestBody Utilisateur utilisateur) {
        return utilisateurService.save(utilisateur);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        utilisateurService.deleteById(id);
    }

    @GetMapping("/{id}")
    public Utilisateur getById(@PathVariable int id) {
        return utilisateurService.findById(id);
    }
}
