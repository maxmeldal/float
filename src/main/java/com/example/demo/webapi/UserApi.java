package com.example.demo.webapi;

import com.example.demo.domain.User;
import com.example.demo.services.UserService;
import org.springframework.stereotype.Component;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;

import java.util.NoSuchElementException;

import static com.example.demo.webapi.ETagger.eTag;
import static javax.ws.rs.core.MediaType.APPLICATION_JSON;

@Component
@Path("/v0")
public class UserApi {

    private final UserService userService;

    @Inject
    public UserApi(UserService userService){
        this.userService = userService;
    }

    @POST
    @Path("users")
    @Produces(APPLICATION_JSON)
    @Consumes(APPLICATION_JSON)
    public User create(User user){
        return this.userService.createUser(user);
    }

    @GET
    @Path("users/{username}+{password}")
    @Produces(APPLICATION_JSON)
    public User login(@PathParam("username") String username, @PathParam("password") String password, @Context HttpServletRequest request, @Context HttpServletResponse response){
        return eTag(
                this.userService.login(username, password)
                        .orElseThrow(() -> new NoSuchElementException("No user matches credentials")),
                request,response);
    }

    @PUT
    @Path("users/{id}")
    @Produces(APPLICATION_JSON)
    @Consumes(APPLICATION_JSON)
    public User putProject(@PathParam("id") String userId, User user) {
        return this.userService.updateUser(user)
                .orElseThrow(() -> new IllegalStateException("Attempting to update a user which doesn't exist. Create it with POST first."));
    }
}
