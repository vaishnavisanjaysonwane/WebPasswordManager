package com.repository;


import com.entity.PasswordEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PasswordRepository extends JpaRepository<PasswordEntry, Long> {
    List<PasswordEntry> findByUser_Username(String username);

}
