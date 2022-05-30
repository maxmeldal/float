package com.example.demo.webapi;

import com.example.demo.domain.Task;
import com.example.demo.services.TaskService;
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
public class TaskApi {
    private final TaskService taskService;

    @Inject
    public TaskApi(TaskService taskService) {
        this.taskService = taskService;
    }

    @POST
    @Path("tasks")
    @Produces(APPLICATION_JSON)
    @Consumes(APPLICATION_JSON)
    public Task create(Task task){
        return this.taskService.createTask(task);
    }

    @GET
    @Path("tasks")
    @Produces(APPLICATION_JSON)
    public Collection<Task> readAll(@Context HttpServletRequest request, @Context HttpServletResponse response){
        return eTag(this.taskService.readTasks(), request, response);
    }

    @GET
    @Path("tasks/{id}")
    @Produces(APPLICATION_JSON)
    public Task getTask(@PathParam("id") String taskId, @Context HttpServletRequest request, @Context HttpServletResponse response){
        return eTag(
                this.taskService.readTask(taskId)
                        .orElseThrow(() -> new NoSuchElementException("No task with id: " + taskId)),
                request,response);
    }

    @GET
    @Path("buckets/{id}/tasks")
    @Produces(APPLICATION_JSON)
    public Collection<Task> getTasksFromBucket(@PathParam("id") String bucketId, @Context HttpServletRequest request, @Context HttpServletResponse response){
        return eTag(this.taskService.readFromBucketId(bucketId), request, response);
    }

    @PUT
    @Path("tasks/{id}")
    @Produces(APPLICATION_JSON)
    @Consumes(APPLICATION_JSON)
    public Task putProject(@PathParam("id") String taskId, Task task) {
        return this.taskService.updateTask(task)
                .orElseThrow(() -> new IllegalStateException("Attempting to update a task which doesn't exist. Create it with POST first."));
    }

    @DELETE
    @Path("tasks/{id}")
    @Consumes(APPLICATION_JSON)
    @Produces(APPLICATION_JSON)
    public boolean deleteTask(@PathParam("id") String taskId, @Context HttpServletRequest request, @Context HttpServletResponse response) {
        return eTag(this.taskService.deleteTask(taskId), request, response);
    }
}
