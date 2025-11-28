package com.service;

import com.entity.PasswordEntry;

import java.util.List;

public interface PasswordService {

    PasswordEntry addPassword(PasswordEntry entry);

    PasswordEntry updatePassword(Long id, PasswordEntry entry);

    Boolean deletePassword(Long id);

    PasswordEntry getPasswordById(Long id);

    List<PasswordEntry> getAllPasswords();
}
