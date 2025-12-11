package com.service;

import com.dto.UserUpdateRequest;
import com.entity.User;

import java.util.Optional;

public interface UserService {

    Optional<User> getUserByUsername(String username);
    User updateUserByUsername(Long id, UserUpdateRequest request);
    boolean changePasswordByUsername(Long id, String oldPassword, String newPassword);
    boolean deleteUserByUsername(Long id);

    User getUserByUserId(Long id);
}
