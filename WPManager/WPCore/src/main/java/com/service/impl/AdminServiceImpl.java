package com.service.impl;

import com.dto.AdminUserDTO;
import com.repository.PasswordRepository;
import com.repository.SupportQueryRepository;
import com.service.AdminService;
import com.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final com.repository.UserRepository userRepository;
    private final PasswordRepository passwordRepository;
    private final SupportQueryRepository supportQueryRepository;

    @Override
    public List<AdminUserDTO> getAllUsers() {
        return userRepository.getAdminUserList();
    }

    @Override
    public AdminUserDTO getUserStats(Long userId) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        AdminUserDTO dto = new AdminUserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());

        dto.setPasswordCount(passwordRepository.countByUserId(user.getId()));
        dto.setQueryCount((long) supportQueryRepository.findByUserUsername(user.getUsername()).size());
        return dto;
    }
}
