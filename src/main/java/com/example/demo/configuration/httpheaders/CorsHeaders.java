package com.example.demo.configuration.httpheaders;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConstructorBinding;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static java.util.stream.Collectors.toList;

/**
 * This class builds a {@link CorsConfiguration} based on the application properties, to be used with Spring Security's
 * CORS filter.
 */
@ConfigurationProperties("cors")
@ConstructorBinding
public class CorsHeaders {
    private static final Logger LOGGER = LoggerFactory.getLogger(CorsHeaders.class);

    public final String AccessControlAllowOrigin;
    public final String AccessControlAllowMethods;
    public final String AccessControlAllowHeaders;
    public final String AccessControlExposeHeaders;
    public final String AccessControlMaxAge;
    public final String AccessControlAllowCredentials;

    public CorsHeaders(String accessControlAllowOrigin, String accessControlAllowMethods, String accessControlAllowHeaders, String accessControlExposeHeaders, String accessControlMaxAge, String accessControlAllowCredentials) {
        AccessControlAllowOrigin = accessControlAllowOrigin;
        AccessControlAllowMethods = accessControlAllowMethods;
        AccessControlAllowHeaders = accessControlAllowHeaders;
        AccessControlExposeHeaders = accessControlExposeHeaders;
        AccessControlMaxAge = accessControlMaxAge;
        AccessControlAllowCredentials = accessControlAllowCredentials;
    }

    public CorsConfiguration getCorsConfiguration() {
        CorsConfiguration cors = new CorsConfiguration();
        asList(this.AccessControlAllowOrigin).ifPresent(cors::setAllowedOrigins);
        asList(this.AccessControlAllowMethods).ifPresent(cors::setAllowedMethods);
        asList(this.AccessControlAllowHeaders).ifPresent(cors::setAllowedHeaders);
        asList(this.AccessControlExposeHeaders).ifPresent(cors::setExposedHeaders);
        asLong(this.AccessControlMaxAge).ifPresent(cors::setMaxAge);
        asTruthy(this.AccessControlAllowCredentials).ifPresent(cors::setAllowCredentials);
        return cors;
    }

    private Optional<List<String>> asList(String value) {
        return value == null || value.isBlank()
                ? Optional.empty()
                : Optional.of(Arrays.stream(value.split(",")).map(String::trim).collect(toList()));
    }

    private Optional<Long> asLong(String value) {
        try {
            return value == null || value.isBlank()
                    ? Optional.empty()
                    : Optional.of(Long.parseLong(value));
        } catch (NumberFormatException nfx) {
            LOGGER.warn("{} is not a number", value);
            return Optional.empty();
        }
    }

    private Optional<Boolean> asTruthy(String value) {
        return value != null && value.trim().equalsIgnoreCase("true")
                ? Optional.of(true)
                : Optional.empty();
    }
}
