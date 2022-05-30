package com.example.demo.services;

import com.example.demo.domain.Task;
import com.example.demo.domain.User;
import org.jdbi.v3.core.Jdbi;
import org.jdbi.v3.core.mapper.reflect.ConstructorMapper;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.sql.DataSource;
import java.util.Optional;

@Service
public class UserService {

    private final Jdbi jdbi;
    @Inject
    public UserService(DataSource dataSource) {
        this.jdbi = Jdbi.create(dataSource)
                .registerRowMapper(ConstructorMapper.factory(User.class));
    }

    public User createUser(User user){
        return this.jdbi.inTransaction(h -> h.createUpdate("""
                        insert into users(id, username, password)
                        values (:id, :username, :password)""")
                .bindMethods(user)
                .executeAndReturnGeneratedKeys()
                .mapTo(User.class)
                .one()
        );
    }

    public Optional<User> login(String username, String password){
        return this.jdbi.withHandle(h -> h
                .createQuery("select * from users where username = :username and password = :password")
                .bind("username", username)
                .bind("password", password)
                .mapTo(User.class)
                .findFirst()
        );
    }

    public Optional<User> updateUser(User user) {
        return this.jdbi.withHandle(h -> (
                h.createUpdate("""
                    update users
                    set (username, password, sounds) = (:username, :password, :sounds)
                    where id = :id""")
        )
                .bindMethods(user)
                .executeAndReturnGeneratedKeys()
                .mapTo(User.class)
                .findFirst());
    }
}
