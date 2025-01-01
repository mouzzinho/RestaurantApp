package restaurant.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.AuthenticationManager;
import restaurant.backend.models.*;
import restaurant.backend.services.UserService;
import restaurant.backend.security.JwtUtils;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserService userService;

    @GetMapping(value = "/user", produces = "application/json")
    public ResponseEntity<?> getUserByToken(@RequestHeader("Authorization") String token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            if (!jwtUtils.validateTokenStructure(token)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ErrorResponse("Struktura tokena jest nieprawidłowa."));
            }

            String username = jwtUtils.extractUsername(token);
            User user = userService.findByUsername(username);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse("Użytkownik o nazwie '" + username + "' nie istnieje."));
            }

            if (!jwtUtils.validateToken(token, user)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse("Nieprawidłowy token."));
            }

            return ResponseEntity.ok(new UserResponse(token, user, jwtUtils));
        }
        catch (JwtUtils.JwtTokenException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Błąd tokena: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Wystąpił błąd: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword());

            Authentication authentication = authenticationManager.authenticate(authToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            User user = userService.findByUsername(loginRequest.getUsername());
            String jwt = jwtUtils.generateToken(user);
            long expireAt = jwtUtils.extractExpiration(jwt).getTime();

            return ResponseEntity.ok(new LoginResponse(jwt, expireAt));
        }
        catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse("Błąd logowania: Niepoprawne dane logowania."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Wystąpił błąd: " + e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            jwtUtils.invalidateToken(token);
            SecurityContextHolder.clearContext();

            return ResponseEntity.ok(new MessageResponse("Użytkownik został wylogowany."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse("Nie udało się wylogować użytkownika: " + e.getMessage()));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request, @RequestHeader("Authorization") String token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            if (!jwtUtils.validateTokenStructure(token)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ErrorResponse("Struktura tokena jest nieprawidłowa."));
            }

            String username = jwtUtils.extractUsername(token);
            User user = userService.findByUsername(username);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse("Użytkownik nie istnieje."));
            }

            if (!jwtUtils.validateToken(token, user)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Nieprawidłowy token."));
            }

            if (!userService.checkPassword(user, request.getOldPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ErrorResponse("Stare hasło jest niepoprawne."));
            }

            if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ErrorResponse("Nowe hasło i jego potwierdzenie nie są zgodne."));
            }

            userService.updatePassword(user, request.getNewPassword());

            return ResponseEntity.ok(new MessageResponse("Hasło zostało zmienione pomyślnie."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Wystąpił błąd: " + e.getMessage()));
        }
    }

    public static class ChangePasswordRequest {
        private String oldPassword;
        private String newPassword;
        private String confirmPassword;

        public String getOldPassword() { return oldPassword; }
        public void setOldPassword(String oldPassword) { this.oldPassword = oldPassword; }

        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }

        public String getConfirmPassword() { return confirmPassword; }
        public void setConfirmPassword(String confirmPassword) { this.confirmPassword = confirmPassword; }
    }

    public static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}