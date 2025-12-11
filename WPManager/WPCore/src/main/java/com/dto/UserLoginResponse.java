package com.dto;

import com.entity.User;
import lombok.Data;

@Data
public class UserLoginResponse {

    private String status;
    private User user;
}
