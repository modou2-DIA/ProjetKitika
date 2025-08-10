package com.kitika.demo.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.Date;

@Service
public class JwtService {
    // configure via application.properties / env is better
    private final Key key = Keys.hmacShaKeyFor(System.getenv().getOrDefault("JWT_SECRET", "a665156b-3bc3-4052-b2d8-6681ac05edb2").getBytes());
    private final long validity = 1000L * 60 * 60 * 24; // 24h

    public String generateToken(String email, String role) {
        return Jwts.builder()
            .setSubject(email)
            .claim("role", role)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + validity))
            .signWith(key, SignatureAlgorithm.HS256)
            .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String getEmailFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
            .parseClaimsJws(token).getBody().getSubject();
    }

    public String getRoleFromToken(String token) {
        Object r = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().get("role");
        return r != null ? r.toString() : null;
    }
}
