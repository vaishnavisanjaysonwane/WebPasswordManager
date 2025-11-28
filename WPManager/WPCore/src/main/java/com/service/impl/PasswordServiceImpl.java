package com.service.impl;

import com.entity.PasswordEntry;
import com.repository.PasswordRepository;
import com.service.PasswordService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class PasswordServiceImpl implements PasswordService {

    private final PasswordRepository passwordRepository;

    public PasswordServiceImpl(PasswordRepository passwordRepository) {
        this.passwordRepository = passwordRepository;
    }

    @Override
    public PasswordEntry addPassword(PasswordEntry entry) {
        log.info("Adding new password entry for website: {}", entry.getWebsite());
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
    public List<PasswordEntry> getAllPasswords() {
        log.info("Fetching all password entries");
        return passwordRepository.findAll();
    }
}
