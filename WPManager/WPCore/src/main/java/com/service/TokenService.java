package com.service;

import com.entity.ResetToken;
import com.entity.User;
import com.repository.ResetTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final ResetTokenRepository tokenRepo;

    public String createResetToken(User user) {
        ResetToken token = new ResetToken();
        token.setToken(UUID.randomUUID().toString());
        token.setUser(user);
        token.setExpiry(LocalDateTime.now().plusMinutes(15)); // 15 min valid

        tokenRepo.save(token);
        return token.getToken();
    }

    public boolean validate(String token) {
        return tokenRepo.findByToken(token)
                .filter(t -> t.getExpiry().isAfter(LocalDateTime.now()))
                .isPresent();
    }

    public User consumeToken(String token) {
        ResetToken t = tokenRepo.findByToken(token).orElseThrow();
        User user = t.getUser();

        tokenRepo.delete(t); // token becomes single-use
        return user;
    }
}
