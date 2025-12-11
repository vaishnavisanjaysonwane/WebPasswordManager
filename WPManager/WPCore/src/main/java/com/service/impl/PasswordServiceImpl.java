package com.service.impl;

import com.entity.PasswordEntry;
import com.entity.User;
import com.repository.PasswordRepository;
import com.repository.UserRepository;
import com.service.PasswordService;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class PasswordServiceImpl implements PasswordService {

    private final PasswordRepository passwordRepository;

    private final UserRepository userRepository;

    public PasswordServiceImpl(PasswordRepository passwordRepository, UserRepository userRepository) {
        this.passwordRepository = passwordRepository;
        this.userRepository = userRepository;
    }

    @Override
    public PasswordEntry addPassword(String username, PasswordEntry entry) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        log.info("User info : {}",user);
        entry.setUser(user);
        entry.setCreatedAt(LocalDateTime.now());
        return passwordRepository.save(entry);
    }

    @Override
    public PasswordEntry updatePassword(Long id, PasswordEntry entry) {
        log.info("Updating password entry with ID: {}", id);

        PasswordEntry existing = passwordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Password entry not found"));

        existing.setWebsite(entry.getWebsite());
        existing.setUsername(entry.getUsername());
        existing.setPassword(entry.getPassword());

        return passwordRepository.save(existing);
    }

    @Override
    public Boolean deletePassword(Long id) {
        log.warn("Deleting password entry with ID: {}", id);
        if (!passwordRepository.existsById(id)) {
            throw new RuntimeException("Password entry not found");
        }
        passwordRepository.deleteById(id);
        log.info("Password entry deleted for ID : {}",id);
        return true;
    }

    @Override
    public PasswordEntry getPasswordById(Long id) {
        log.info("Fetching password entry with ID: {}", id);
        return passwordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Password entry not found"));
    }

    @Override
    public List<PasswordEntry> getAllPasswords(String username) {
        return passwordRepository.findByUserId(Long.parseLong(username));
    }
}
