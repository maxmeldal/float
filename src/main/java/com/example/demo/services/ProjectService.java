package com.example.demo.services;

import com.example.demo.domain.Bucket;
import com.example.demo.domain.Project;
import com.example.demo.domain.Task;
import org.jdbi.v3.core.Jdbi;
import org.jdbi.v3.core.mapper.reflect.ConstructorMapper;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.sql.DataSource;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {
    private final Jdbi jdbi;
    private final BucketService bucketService;
    @Inject
    public ProjectService(DataSource dataSource, BucketService bucketService) {
        this.jdbi = Jdbi.create(dataSource)
                .registerRowMapper(ConstructorMapper.factory(Project.class));
        this.bucketService = bucketService;
    }

    public Project createProject(Project project) {
        Project result = this.jdbi.inTransaction(h -> h.createUpdate("""
                        insert into projects(id, name, description, created_at, deadline, hour_estimate, price, user_id)
                        values (:id, :name, :description, :createdAt, :deadline, :hourEstimate, :price, :userId)""")
                .bindMethods(project)
                .executeAndReturnGeneratedKeys()
                .mapTo(Project.class)
                .one()
        );
        this.bucketService.createBucket(new Bucket(null, "backlog", result.id(), new ArrayList<Task>()));
        this.bucketService.createBucket(new Bucket(null, "to-do", result.id(), new ArrayList<Task>()));
        this.bucketService.createBucket(new Bucket(null, "doing", result.id(), new ArrayList<Task>()));
        this.bucketService.createBucket(new Bucket(null, "done", result.id(), new ArrayList<Task>()));
        return result;
    }

    public Optional<Project> readProject(String projectId) {
        return this.jdbi.withHandle( h -> h
                .createQuery("select * from projects where id = :id")
                .bind("id", projectId)
                .mapTo(Project.class)
                .findFirst()
        );
    }

    public List<Project> readProjects(){
        return this.jdbi.withHandle(h -> h
                .createQuery("select * from projects")
                .mapTo(Project.class)
                .list()
        );
    }

    public List<Project> readProjectsFromUserId(String id){
        return this.jdbi.withHandle(h -> h
                .createQuery("select * from projects where user_id = :id")
                .bind("id", id)
                .mapTo(Project.class)
                .list()
        );
    }

    public Optional<Project> updateProject(Project project) {
        return this.jdbi.withHandle(h -> (
                h.createUpdate("""
                    update projects
                    set (name, description, deadline, hour_estimate, price) = (:name, :description, :deadline, :hourEstimate, :price)
                    where id = :id""")
                )
                        .bindMethods(project)
                        .executeAndReturnGeneratedKeys()
                        .mapTo(Project.class)
                        .findFirst());
    }

    public boolean deleteProject(String projectId) {
        return this.jdbi.withHandle( h ->
                h.createUpdate("delete from projects where id = :id")
                        .bind("id", projectId)
                        .execute()
                > 0
        );
    }
}
