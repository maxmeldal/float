package com.example.demo.webapi;

import com.example.demo.domain.Bucket;
import com.example.demo.domain.Task;
import com.example.demo.services.BucketService;
import com.example.demo.services.TaskService;
import org.springframework.stereotype.Component;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import java.util.Collection;
import java.util.List;
import java.util.NoSuchElementException;

import static com.example.demo.webapi.ETagger.eTag;
import static javax.ws.rs.core.MediaType.APPLICATION_JSON;

@Component
@Path("/v0")
public class BucketApi {
    private final BucketService bucketService;
    private final TaskService taskService;

    @Inject
    public BucketApi(BucketService bucketService, TaskService taskService) {
        this.taskService = taskService;
        this.bucketService = bucketService;
    }

    @POST
    @Path("buckets")
    @Produces(APPLICATION_JSON)
    @Consumes(APPLICATION_JSON)
    public Bucket create(Bucket bucket){
        return this.bucketService.createBucket(bucket);
    }

    @GET
    @Path("buckets")
    @Produces(APPLICATION_JSON)
    public Collection<Bucket> readAll(@Context HttpServletRequest request, @Context HttpServletResponse response){
        return eTag(this.bucketService.readBuckets(), request, response);
    }

    @GET
    @Path("buckets/{id}")
    @Produces(APPLICATION_JSON)
    public Bucket getBucket(@PathParam("id") String bucketId, @Context HttpServletRequest request, @Context HttpServletResponse response){
        return eTag(
                this.bucketService.readBucket(bucketId)
                        .orElseThrow(() -> new NoSuchElementException("No bucket with id: " + bucketId)),
                request,response);
    }

    @GET
    @Path("projects/{id}/buckets")
    @Produces(APPLICATION_JSON)
    public Collection<Bucket> getBucketFromProject(@PathParam("id") String projectId, @Context HttpServletRequest request, @Context HttpServletResponse response){
        List<Bucket> buckets = this.bucketService.readFromProjectId(projectId);
        for (Bucket bucket:buckets) {
            bucket.tasks().addAll(this.taskService.readFromBucketId(bucket.id()));
        }
        return eTag(buckets, request, response);
    }

    @PUT
    @Path("buckets/{id}")
    @Produces(APPLICATION_JSON)
    @Consumes(APPLICATION_JSON)
    public Bucket putProject(@PathParam("id") String taskId, Bucket bucket) {
        return this.bucketService.updateBucket(bucket)
                .orElseThrow(() -> new IllegalStateException("Attempting to update a bucket which doesn't exist. Create it with POST first."));
    }

    @DELETE
    @Path("buckets/{id}")
    @Consumes(APPLICATION_JSON)
    @Produces(APPLICATION_JSON)
    public void deleteBucket(@PathParam("id") String bucketId) {
        if (!this.bucketService.deleteBucket(bucketId)) {
            throw new IllegalStateException("Attempting to delete non-existing bucket");
        }
    }
}
