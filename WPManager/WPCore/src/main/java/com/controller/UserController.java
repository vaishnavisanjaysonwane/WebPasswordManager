package com.controller;

import com.dto.UserUpdateRequest;
import com.entity.User;
import com.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(
        origins = "http://127.0.0.1:5500",
        allowCredentials = "true"
)
public class UserController {

    private final UserService userService;

    // ----------------------- GET USER BY USERNAME -----------------------
    @GetMapping("/{username}")
    public ResponseEntity<?> getUser(@PathVariable String username) {
        log.info("Fetching user with username: {}", username);

        User user = userService.getUserByUsername(username)
                .orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        return ResponseEntity.ok(user);
    }

    // ----------------------- UPDATE PROFILE ------------------------------
    @PutMapping("/update/{username}")
    public ResponseEntity<?> updateProfile(
            @PathVariable String username,
            @RequestBody UserUpdateRequest request) {

        log.info("API: Update user {}", username);
        try {
            User updated = userService.updateUserByUsername(username, request);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Update failed: " + e.getMessage());
        }
    }

    // ----------------------- CHANGE PASSWORD ------------------------------
    @PutMapping("/change-password/{username}")
    public ResponseEntity<?> changePassword(
            @PathVariable String username,
            @RequestParam String oldPassword,
            @RequestParam String newPassword) {

        log.info("API: Change password for username {}", username);

        boolean status = userService.changePasswordByUsername(username, oldPassword, newPassword);

        if (status)
            return ResponseEntity.ok("Password updated successfully");
        else
            return ResponseEntity.badRequest().body("Old password is incorrect");
    }

    // ----------------------- DELETE USER ---------------------------------
    @DeleteMapping("/delete/{username}")
    public ResponseEntity<?> deleteUser(@PathVariable String username) {
        log.info("API: Delete user {}", username);

        boolean deleted = userService.deleteUserByUsername(username);

        if (deleted)
            return ResponseEntity.ok("User deleted");
        else
            return ResponseEntity.badRequest().body("User not found");
    }
}
