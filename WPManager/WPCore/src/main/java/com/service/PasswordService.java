package com.service;

import com.entity.PasswordEntry;
import org.jspecify.annotations.Nullable;

import java.util.List;

public interface PasswordService {

    PasswordEntry addPassword(String username, PasswordEntry entry);

    PasswordEntry updatePassword(Long id, PasswordEntry entry);

    Boolean deletePassword(Long id);

    PasswordEntry getPasswordById(Long id);

    @Nullable List<PasswordEntry> getAllPasswords(String username);
}
