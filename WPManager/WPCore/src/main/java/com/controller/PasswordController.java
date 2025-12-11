package com.controller;

import com.entity.PasswordEntry;
import com.service.PasswordService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/passwords")
@Slf4j
@CrossOrigin(
        origins = "http://127.0.0.1:5500",
        allowCredentials = "true"
)
public class PasswordController {

    private final PasswordService passwordService;

    public PasswordController(PasswordService passwordService) {
        this.passwordService = passwordService;
    }

    // ADD
    @PostMapping("/{username}")
    public ResponseEntity<PasswordEntry> addPassword(
            @PathVariable String username,
            @RequestBody PasswordEntry entry
    ){
        log.info("API Request → Add password for website: {}", entry.getWebsite());
        return ResponseEntity.ok(passwordService.addPassword(username, entry));
    }

    // UPDATE
    @PutMapping("/id/{id}")
    public ResponseEntity<PasswordEntry> updatePassword(
            @PathVariable Long id,
            @RequestBody PasswordEntry entry
    ) {
        log.info("API Request → Update password for ID: {}", id);
        PasswordEntry updated = passwordService.updatePassword(id, entry);
        return ResponseEntity.ok(updated);
    }

    // DELETE
    @DeleteMapping("/id/{id}")
    public ResponseEntity<String> deletePassword(@PathVariable Long id) {
        log.warn("API Request → Delete password with ID: {}", id);
        passwordService.deletePassword(id);
        return ResponseEntity.ok("Deleted Successfully");
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<PasswordEntry> getById(@PathVariable Long id) {
        log.info("API Request → Get password by ID: {}", id);
        PasswordEntry entry = passwordService.getPasswordById(id);
        return ResponseEntity.ok(entry);
    }

    // GET ALL (Bulk View)
    @GetMapping("/{username}/all")
    public ResponseEntity<List<PasswordEntry>> getAll(@PathVariable String username) {
        return ResponseEntity.ok(passwordService.getAllPasswords(username));
    }
}
