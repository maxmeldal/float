package com.example.demo.services;

import com.example.demo.domain.Task;
import org.jdbi.v3.core.Jdbi;
import org.jdbi.v3.core.mapper.reflect.ConstructorMapper;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.sql.DataSource;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final Jdbi jdbi;
    @Inject
    public TaskService(DataSource dataSource) {
        this.jdbi = Jdbi.create(dataSource)
                .registerRowMapper(ConstructorMapper.factory(Task.class));
    }

    public Task createTask(Task task) {
        return this.jdbi.inTransaction(h -> h.createUpdate("""
                        insert into tasks(id, name, description, color, bucket_id)
                        values (:id, :name, :description, :color, :bucketId)""")
                .bindMethods(task)
                .executeAndReturnGeneratedKeys()
                .mapTo(Task.class)
                .one()
        );
    }

    public Optional<Task> readTask(String taskId) {
        return this.jdbi.withHandle( h -> h
                .createQuery("select * from tasks where id = :id")
                .bind("id", taskId)
                .mapTo(Task.class)
                .findFirst()
        );
    }

    public List<Task> readTasks(){
        return this.jdbi.withHandle(h -> h
                .createQuery("select * from tasks")
                .mapTo(Task.class)
                .list()
        );
    }

    public Optional<Task> updateTask(Task task) {
        return this.jdbi.withHandle(h -> (
                h.createUpdate("""
                    update tasks
                    set (name, description, color, bucket_id) = (:name, :description, :color, :bucketId)
                    where id = :id""")
        )
                .bindMethods(task)
                .executeAndReturnGeneratedKeys()
                .mapTo(Task.class)
                .findFirst());
    }

    public boolean deleteTask(String taskId) {
        return this.jdbi.withHandle( h ->
                h.createUpdate("delete from tasks where id = :id")
                        .bind("id", taskId)
                        .execute()
                        > 0
        );
    }
    public List<Task> readFromBucketId(String id) {
        return this.jdbi.withHandle(h -> h
                .createQuery("select * from tasks where bucket_id = :id")
                .bind("id", id)
                .mapTo(Task.class)
                .list()
        );
    }
}
