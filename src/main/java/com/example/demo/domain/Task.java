package com.example.demo.domain;

import org.springframework.lang.Nullable;

import java.util.UUID;

public record Task(
        @Nullable String id,
        String name,
        @Nullable String description,
        String bucketId,
        @Nullable String color
) {
    public Task{
        if (id==null){
            id = String.valueOf(UUID.randomUUID());
        }
    }
}
