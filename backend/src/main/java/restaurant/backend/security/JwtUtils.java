package restaurant.backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.Claims;
import javax.crypto.SecretKey;
import java.util.*;
import java.util.function.Function;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import restaurant.backend.models.User;

@Component
public class JwtUtils {

    private final SecretKey secretKey;
    private final Set<String> blacklistedTokens = new HashSet<>();

    public JwtUtils(@Value("${jwt.secret.key}") String secretKeyString) {
        byte[] decodedKey = Base64.getDecoder().decode(secretKeyString);
        this.secretKey = Keys.hmacShaKeyFor(decodedKey);
    }

    public static class JwtTokenException extends RuntimeException {
        public JwtTokenException(String message) {
            super(message);
        }
    }

    public String extractUsername(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return claims.getSubject();
        } catch (Exception e) {
            throw new JwtTokenException("Token jest nieprawidłowy.");
        }
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, user.getUsername());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 16))
                .signWith(secretKey)
                .compact();
    }

    public boolean validateTokenStructure(String token) {
        return token != null && token.split("\\.").length == 3;
    }

    public boolean validateToken(String token, User user) {
        final String username = extractUsername(token);
        return username.equals(user.getUsername())
                && !isTokenExpired(token)
                && !isTokenInvalidated(token);
    }

    public void invalidateToken(String token) {
        blacklistedTokens.add(token);
    }

    public boolean isTokenInvalidated(String token) {
        return blacklistedTokens.contains(token);
    }
}