package com.example.demo.webapi;

import org.springframework.lang.Nullable;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import java.util.Objects;

public class ETagger {
    public static <T> T eTag(T data, @Nullable HttpServletRequest request, @Nullable HttpServletResponse response) {
        if (request == null || response == null) {
            return data;
        }
        var clientETag = request.getHeader("If-None-Match");
        var serverETag = "W/\"" + Objects.hashCode(data) + "\"";
        if (serverETag.equals(clientETag)) {
            // I don't like use exceptions for flow control here, but otherwise we need to return Response objects from all
            // RxJs methods, obscuring the return types.
            throw new WebApplicationException(Response.status(304).build());
        } else {
            response.setHeader("ETag", serverETag);
            return data;
        }
    }
}
