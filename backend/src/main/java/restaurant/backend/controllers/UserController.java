package restaurant.backend.controllers;

import java.util.List;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import restaurant.backend.models.User;
import restaurant.backend.models.UserResponse;
import restaurant.backend.models.UserWorktime;
import restaurant.backend.repositories.UserRepository;
import restaurant.backend.repositories.UserWorktimeRepository;
import restaurant.backend.security.JwtUtils;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final UserWorktimeRepository userWorktimeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public UserController(UserRepository userRepository, UserWorktimeRepository userWorktimeRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.userWorktimeRepository = userWorktimeRepository;
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

    @GetMapping("/{id}/worktime")
    public ResponseEntity<List<UserWorktime>> getUserWorktimeByMonth(
            @PathVariable Integer id,
            @RequestParam Integer year,
            @RequestParam Integer month) {

        List<UserWorktime> worktimes = userWorktimeRepository.findAllByUserIdAndYearAndMonth(id, year, month);

        return ResponseEntity.ok(worktimes);
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

    @PostMapping("/{id}/worktime")
    public ResponseEntity<UserWorktime> createWorktime(
            @PathVariable Integer id,
            @RequestBody WorktimeRequest request) {

        UserWorktime worktime = new UserWorktime();
        worktime.setUser_id(id);
        worktime.setDate_start(request.getDate_start());
        worktime.setDate_end(request.getDate_end());

        UserWorktime savedWorktime = userWorktimeRepository.save(worktime);
        return ResponseEntity.ok(savedWorktime);
    }

    @PatchMapping("/{id}/worktime/{worktimeId}")
    public ResponseEntity<UserWorktime> updateWorktime(
            @PathVariable Integer id,
            @PathVariable Integer worktimeId,
            @RequestBody WorktimeRequest request) {

        Optional<UserWorktime> optionalWorktime = userWorktimeRepository.findByIdAndUserId(worktimeId, id);

        if (optionalWorktime.isPresent()) {
            UserWorktime worktime = optionalWorktime.get();
            worktime.setDate_start(request.getDate_start());
            worktime.setDate_end(request.getDate_end());

            UserWorktime updatedWorktime = userWorktimeRepository.save(worktime);
            return ResponseEntity.ok(updatedWorktime);
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

    public static class WorktimeRequest {
        private Long date_start;
        private Long date_end;

        public WorktimeRequest() {}

        public Long getDate_start() { return date_start; }
        public void setDate_start(Long date_start) { this.date_start = date_start; }

        public Long getDate_end() { return date_end; }
        public void setDate_end(Long date_end) { this.date_end = date_end; }
    }
}