package com.service;

import com.dto.UserUpdateRequest;
import com.entity.User;

import java.util.Optional;

public interface UserService {

    Optional<User> getUserById(Long id);

    User updateUser(Long id, UserUpdateRequest request);

    boolean changePassword(Long id, String oldPassword, String newPassword);

    boolean deleteUser(Long id);
}
