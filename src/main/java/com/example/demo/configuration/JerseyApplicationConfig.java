package com.example.demo.configuration;

import com.example.demo.webapi.BucketApi;
import com.example.demo.webapi.ProjectApi;
import com.example.demo.webapi.TaskApi;
import com.example.demo.webapi.UserApi;
import org.glassfish.jersey.server.ResourceConfig;
import org.springframework.stereotype.Component;

import javax.ws.rs.ApplicationPath;

@Component
@ApplicationPath("/api")
public class JerseyApplicationConfig extends ResourceConfig {
    public JerseyApplicationConfig(){
        register(ProjectApi.class);
        register(BucketApi.class);
        register(TaskApi.class);
        register(UserApi.class);
    }
}
