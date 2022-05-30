package com.example.demo.webapi;

import com.example.demo.domain.Project;
import com.example.demo.services.ProjectService;
import org.springframework.stereotype.Component;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;

import java.util.Collection;
import java.util.NoSuchElementException;


import static com.example.demo.webapi.ETagger.eTag;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;


@Component
@Path("/v0")
public class ProjectApi {

    private final ProjectService projectService;

    @Inject
    public ProjectApi(ProjectService projectService) {
        this.projectService = projectService;
    }

    @POST
    @Path("projects")
    @Produces(APPLICATION_JSON)
    @Consumes(APPLICATION_JSON)
    public Project create(Project project){
        return this.projectService.createProject(project);
    }

    @GET
    @Path("projects")
    @Produces(APPLICATION_JSON)
    public Collection<Project> readAll(@Context HttpServletRequest request, @Context HttpServletResponse response){
        return eTag(this.projectService.readProjects(), request, response);
    }

    @GET
    @Path("users/{id}/projects")
    @Produces(APPLICATION_JSON)
    public Collection<Project> readAllFromUser(@PathParam("id")String userId, @Context HttpServletRequest request, @Context HttpServletResponse response){
        return eTag(this.projectService.readProjectsFromUserId(userId), request, response);
    }

    @GET
    @Path("projects/{id}")
    @Produces(APPLICATION_JSON)
    public Project getProject(@PathParam("id") String projectId, @Context HttpServletRequest request, @Context HttpServletResponse response){
        return eTag(
                this.projectService.readProject(projectId)
                        .orElseThrow(() -> new NoSuchElementException("No project with id: " + projectId)),
                request,response);
    }

    @PUT
    @Path("projects/{id}")
    @Produces(APPLICATION_JSON)
    @Consumes(APPLICATION_JSON)
    public Project putProject(@PathParam("id") String projectId, Project project) {
        return this.projectService.updateProject(project)
                .orElseThrow(() -> new IllegalStateException("Attempting to update a project which doesn't exist. Create it with POST first."));
    }

    @DELETE
    @Path("projects/{id}")
    @Consumes(APPLICATION_JSON)
    @Produces(APPLICATION_JSON)
    public boolean deleteProject(@PathParam("id") String projectId, @Context HttpServletRequest request, @Context HttpServletResponse response) {
        return eTag(this.projectService.deleteProject(projectId), request, response);
    }
}
