package com.service.impl;

import com.dto.UserUpdateRequest;
import com.entity.User;
import com.repository.UserRepository;
import com.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // --------------------- GET USER -------------------------
    @Override
    public Optional<User> getUserByUsername(String username) {
        log.info("Fetching user by username: {}", username);
        return userRepository.findByUsername(username);
    }

    // ------------------- UPDATE USER PROFILE ----------------
    @Override
    public User updateUserByUsername(Long id, UserUpdateRequest request) {
        log.info("Updating user with username: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());

        return userRepository.save(user);
    }

    // ------------------- CHANGE PASSWORD --------------------
    @Override
    public boolean changePasswordByUsername(Long id, String oldPassword, String newPassword) {
        log.info("Password change request for username: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            log.warn("Old password does not match for username: {}", id);
            return false;
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }

    // ------------------- DELETE USER ------------------------
    @Override
    public boolean deleteUserByUsername(Long id) {
        log.info("Deleting user with username: {}", id);

        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            log.warn("User not found with username: {}", id);
            return false;
        }

        userRepository.delete(userOpt.get());
        return true;
    }

    @Override
    public User getUserByUserId(Long id) {
        log.info("Updating user with userId: {}", id);

        Optional<User> user = userRepository.findById(id);

        return user.get();
    }
}
