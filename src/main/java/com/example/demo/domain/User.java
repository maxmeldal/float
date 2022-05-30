package com.example.demo.domain;

import org.springframework.lang.Nullable;

import java.util.UUID;

public record User(
        @Nullable String id,
        String username,
        String password,
        @Nullable boolean sounds
) {
    public User{
        if (id==null){
            id = String.valueOf(UUID.randomUUID());
        }
    }
}
