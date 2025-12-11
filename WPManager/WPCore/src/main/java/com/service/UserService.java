package com.service;

import com.dto.UserUpdateRequest;
import com.entity.User;

import java.util.Optional;

public interface UserService {

    Optional<User> getUserByUsername(String username);
    User updateUserByUsername(String username, UserUpdateRequest request);
    boolean changePasswordByUsername(String username, String oldPassword, String newPassword);
    boolean deleteUserByUsername(String username);

    User getUserByUserId(Long id);
}
