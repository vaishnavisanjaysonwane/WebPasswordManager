package com.controller;

import com.dto.SupportQueryDto;
import com.service.impl.SupportQueryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/support")
@CrossOrigin(origins = "http://127.0.0.1:5500", allowCredentials = "true")
@Slf4j
public class SupportController {

    @Autowired
    private SupportQueryService supportQueryService;

    // Create a new query
    @PostMapping
    public ResponseEntity<?> createQuery(@RequestBody SupportQueryDto dto, Principal principal) {
        try {
            // Username comes from DTO (sent by frontend)
            // OR from principal (if session login)
            String userName = dto.getUsername();
            dto.setUsername(userName);

            SupportQueryDto created = supportQueryService.createQuery(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);

        } catch (Exception e) {
            log.error("Error creating query", e);
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // Get all queries for a user
    @GetMapping("/{userName}")
    public ResponseEntity<?> getQueries(@PathVariable String userName, Principal principal) {
        try {
            List<SupportQueryDto> queries = supportQueryService.getQueriesByUserName(userName);
            return ResponseEntity.ok(queries);

        } catch (Exception e) {
            log.error("Error fetching queries", e);
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/id/{userId}")
    public ResponseEntity<?> getQueriesByUser(@PathVariable Long userId) {
        try {
            List<SupportQueryDto> queries = supportQueryService.getQueriesByUserId(userId);
            return ResponseEntity.ok(queries);
        } catch (Exception e) {
            return ResponseEntity.status(400)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    // Update query
    @PutMapping("/{queryId}")
    public ResponseEntity<?> updateQuery(
            @PathVariable Long queryId,
            @RequestBody SupportQueryDto dto,
            Principal principal) {
        try {
            String userName = dto.getUsername();

            SupportQueryDto updated = supportQueryService.updateQuery(queryId, userName, dto);
            return ResponseEntity.ok(updated);

        } catch (Exception e) {
            log.error("Error updating query", e);
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // Delete query
    @DeleteMapping("/{queryId}")
    public ResponseEntity<?> deleteQuery(@PathVariable Long queryId, Principal principal) {
        try {
            // You can also use dto.getUserName() if you prefer
            String userName = principal != null ? principal.getName() : null;

            supportQueryService.deleteQuery(queryId, userName);
            return ResponseEntity.noContent().build();

        } catch (Exception e) {
            log.error("Error deleting query", e);
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }
}
