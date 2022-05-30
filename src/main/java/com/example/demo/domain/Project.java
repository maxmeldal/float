package com.example.demo.domain;

import org.springframework.lang.Nullable;

import java.time.Instant;
import java.util.UUID;

public record Project(
        @Nullable String id,
        String name,
        @Nullable String description,
        @Nullable Instant createdAt,
        @Nullable Instant deadline,
        @Nullable int hourEstimate,
        @Nullable double price,
        String userId
) {
    public Project{
        if (id==null){
            id = String.valueOf(UUID.randomUUID());
        }
    }
}
