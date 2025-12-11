package com.controller;

import com.dto.UserLoginRequest;
import com.dto.UserLoginResponse;
import com.dto.UserRegisterRequest;
import com.entity.User;
import com.service.UserAuthService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(
        origins = "http://127.0.0.1:5500",
        allowCredentials = "true"
)
public class AuthController {

    private final UserAuthService userAuthService;

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody UserRegisterRequest request) {
        log.info("API: Register user {}", request.getUsername());

        try {
            User user = userAuthService.register(request);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            log.error("Registration failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/auth/login")
    public ResponseEntity<UserLoginResponse> login(@RequestBody UserLoginRequest request, HttpSession session) {
        log.info("API: Login attempt for {}", request.getUsername());

        try {
            User user = userAuthService.login(request);

            // ---- Create session for 1 minute ----
            session.setAttribute("userId", user.getId());
            session.setMaxInactiveInterval(60); // 60 seconds

            log.info("User {} logged in successfully. Session active for 1 minute.", request.getUsername());
            UserLoginResponse userLoginResponse = new UserLoginResponse();
            userLoginResponse.setStatus("Login Successfully");
            userLoginResponse.setUser(user);

            return ResponseEntity.ok(userLoginResponse);
        } catch (Exception e) {
            log.error("Login failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }

    // ---------------- Logout ----------------
    @PostMapping("/auth/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.badRequest().body("No active session");
        }

        session.invalidate();
        log.info("User {} logged out. Session invalidated.", userId);

        return ResponseEntity.ok("Logout successful");
    }
}
