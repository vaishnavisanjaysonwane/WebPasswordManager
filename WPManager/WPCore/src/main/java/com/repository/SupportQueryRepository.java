package com.repository;

import com.entity.SupportQuery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportQueryRepository extends JpaRepository<SupportQuery, Long> {
    List<SupportQuery> findByUserIdAndStatus(Long userId, String status);

    List<SupportQuery> findByUserUsername(String username);

    List<SupportQuery> findByUser_Id(String userName);

    List<SupportQuery> findByUserId(Long userId);
}
