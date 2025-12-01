package com.service.impl;

import com.dto.UserLoginRequest;
import com.dto.UserRegisterRequest;
import com.entity.User;
import com.repository.UserRepository;
import com.service.UserAuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserAuthServiceImpl implements UserAuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public User register(UserRegisterRequest request) {
        log.info("Registering new user: {}", request.getUsername());

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        return userRepository.save(user);
    }

    @Override
    public User login(UserLoginRequest request) {
        Optional<User> user = userRepository.findByUsername(request.getUsername());
        if (user.isEmpty())
            throw new RuntimeException("User Not Register");

        if (!passwordEncoder.matches(request.getPassword(), user.get().getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        return user.get();
    }

}
