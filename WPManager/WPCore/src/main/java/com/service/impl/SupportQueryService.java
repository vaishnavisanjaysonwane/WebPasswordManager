package com.service.impl;

import com.dto.SupportQueryDto;
import com.entity.SupportQuery;
import com.entity.User;
import com.repository.SupportQueryRepository;
import com.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class SupportQueryService {
    @Autowired
    private SupportQueryRepository repository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    // Create new query
    public SupportQueryDto createQuery(SupportQueryDto dto) {

        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        SupportQuery query = new SupportQuery();
        query.setUser(user);
        query.setSubject(dto.getSubject());
        query.setMessage(dto.getMessage());
        query.setStatus(dto.getStatus() == null ? "pending" : dto.getStatus());
        query.setCreatedAt(LocalDateTime.now());
        query.setUpdatedAt(LocalDateTime.now());

        SupportQuery saved = repository.save(query);

        log.info("Support query created: id={}, userId={}", saved.getId(), saved.getUser().getId());

        return modelMapper.map(saved, SupportQueryDto.class);
    }


    // Get all queries for a user
    public List<SupportQueryDto> getQueriesByUserName(String userName) {
        List<SupportQuery> queries = repository.findByUser_Id(userName);
        return queries.stream()
                .map(q -> modelMapper.map(q, SupportQueryDto.class))
                .collect(Collectors.toList());
    }

    // Get query by ID (with ownership check)
    public SupportQueryDto getQueryById(Long id) {
        SupportQuery query = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Query not found"));
//        if (!query.getUser().getId().equals(userId)) {
//            throw new RuntimeException("Unauthorized access");
//        }
        return modelMapper.map(query, SupportQueryDto.class);
    }

    // Update query
    public SupportQueryDto updateQuery(Long id, String userName, SupportQueryDto dto) {
        SupportQuery query = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Query not found"));
//        if (!query.getUser().getUsername().equals(userName)) {
//            throw new RuntimeException("Unauthorized access");
//        }

        if (dto.getSubject() != null) query.setSubject(dto.getSubject());
        if (dto.getMessage() != null) query.setMessage(dto.getMessage());
        if (dto.getStatus() != null) query.setStatus(dto.getStatus());
        query.setUpdatedAt(LocalDateTime.now());

        SupportQuery updated = repository.save(query);
        log.info("Support query updated: id={}, userId={}", id, userName);
        return modelMapper.map(updated, SupportQueryDto.class);
    }

    // Delete query
    public void deleteQuery(Long id, String userName) {
        SupportQuery query = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Query not found"));
        if (!query.getUser().getUsername().equals(userName)) {
            throw new RuntimeException("Unauthorized access");
        }
        repository.delete(query);
        log.info("Support query deleted: id={}, userId={}", id, userName);
    }

    public List<SupportQueryDto> getQueriesByUserId(Long userId) {
        List<SupportQuery> queries = repository.findByUserId(userId);

        return queries.stream()
                .map(q -> modelMapper.map(q, SupportQueryDto.class))
                .collect(Collectors.toList());
    }

}