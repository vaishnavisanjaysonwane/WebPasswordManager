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
    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        log.info("Fetching user with userId: {}", id);

        User user = userService.getUserByUserId(id);

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        return ResponseEntity.ok(user);
    }

    // ----------------------- UPDATE PROFILE ------------------------------
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long id,
            @RequestBody UserUpdateRequest request) {

        log.info("API: Update user {}", id);
        try {
            User updated = userService.updateUserByUsername(id, request);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Update failed: " + e.getMessage());
        }
    }

    // ----------------------- CHANGE PASSWORD ------------------------------
    @PutMapping("/change-password/{id}")
    public ResponseEntity<?> changePassword(
            @PathVariable Long id,
            @RequestParam String oldPassword,
            @RequestParam String newPassword) {

        log.info("API: Change password for username {}", id);

        boolean status = userService.changePasswordByUsername(id, oldPassword, newPassword);

        if (status)
            return ResponseEntity.ok("Password updated successfully");
        else
            return ResponseEntity.badRequest().body("Old password is incorrect");
    }

    // ----------------------- DELETE USER ---------------------------------
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        log.info("API: Delete user {}", id);

        boolean deleted = userService.deleteUserByUsername(id);

        if (deleted)
            return ResponseEntity.ok("User deleted");
        else
            return ResponseEntity.badRequest().body("User not found");
    }
}
