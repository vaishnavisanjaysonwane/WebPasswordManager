package com.repository;

import com.dto.AdminUserDTO;
import com.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Optional<User> findByUsername(String username);

    @Query("""
            SELECT new com.dto.AdminUserDTO(
                u.id,
                u.username,
                u.email,
                (SELECT COUNT(p.id) FROM PasswordEntry p WHERE p.user.username = u.username),
                (SELECT COUNT(s.id) FROM SupportQuery s WHERE s.user.id = u.id)
            )
            FROM User u
            """)
    List<AdminUserDTO> getAdminUserList();

    Optional<User> findById(Long id);
}
