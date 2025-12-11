package com.service;

import com.dto.AdminUserDTO;
import java.util.List;

public interface AdminService {

    List<AdminUserDTO> getAllUsers();

    AdminUserDTO getUserStats(Long userId);
}
