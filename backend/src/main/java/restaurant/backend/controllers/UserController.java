package restaurant.backend.controllers;

import java.util.List;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import restaurant.backend.models.User;
import restaurant.backend.models.UserResponse;
import restaurant.backend.repositories.UserRepository;
import restaurant.backend.security.JwtUtils;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Integer id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String token = jwtUtils.generateToken(user);

            return ResponseEntity.ok(new UserResponse(token, user, jwtUtils));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User newUser) {
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        User savedUser = userRepository.save(newUser);
        return ResponseEntity.ok(savedUser);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Integer id, @RequestBody User userDetails) {
        Optional<User> userOptional = userRepository.findById(id);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setName(userDetails.getName());
            user.setEmail(userDetails.getEmail());
            user.setPhone(userDetails.getPhone());
            user.setImage(userDetails.getImage());
            user.setRole(userDetails.getRole());
            user.setUsername(userDetails.getUsername());
            String token = jwtUtils.generateToken(user);

            User updatedUser = userRepository.save(user);
            return ResponseEntity.ok(new UserResponse(token, updatedUser, jwtUtils));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        Optional<User> user = userRepository.findById(id);

        if (user.isPresent()) {
            userRepository.delete(user.get());
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}