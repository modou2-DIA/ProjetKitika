package com.kitika.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.kitika.demo.model.Utilisateur;
import com.kitika.demo.repository.UtilisateurRepository;
import com.kitika.demo.security.JwtService;
import com.kitika.demo.dto.LoginRequest;
import com.kitika.demo.dto.LoginResponse;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        var opt = utilisateurRepository.findByEmail(request.email());
        if (opt.isEmpty()) return ResponseEntity.status(401).body("Utilisateur non trouvé");
        Utilisateur u = opt.get();
        if (!passwordEncoder.matches(request.motDePasse(), u.getMotDePasse())) {
            return ResponseEntity.status(401).body("Mot de passe incorrect");
        }
        String token = jwtService.generateToken(u.getEmail(), u.getRole());
        return ResponseEntity.ok(new LoginResponse(token, u.getNom(), u.getRole()));
    }

    // Optionnel: endpoint register pour self-register (si tu veux autoriser)
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Utilisateur u) {
        if (utilisateurRepository.findByEmail(u.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email déjà utilisé");
        }
        // hash password manually here or via service
        u.setMotDePasse(passwordEncoder.encode(u.getMotDePasse()));
        u.setActif(true);
        if (u.getRole() == null) u.setRole("RECEPTIONNISTE");
        Utilisateur saved = utilisateurRepository.save(u);
        return ResponseEntity.ok(saved);
    }
}
