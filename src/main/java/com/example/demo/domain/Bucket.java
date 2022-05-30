package com.example.demo.domain;

import org.springframework.lang.Nullable;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public record Bucket(
        @Nullable String id,
        String name,
        String projectId,
        @Nullable List<Task> tasks
) {
    public Bucket{
        if (id==null){
            id = String.valueOf(UUID.randomUUID());
        }
        if (tasks==null) {
            tasks = new ArrayList<>();
        }
    }
}
