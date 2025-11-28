package com.service;

import com.dto.UserLoginRequest;
import com.dto.UserRegisterRequest;
import com.entity.User;

public interface UserAuthService {

    User register(UserRegisterRequest request);
    User login(UserLoginRequest request);

}
