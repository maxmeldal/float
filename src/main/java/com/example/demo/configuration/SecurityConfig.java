package com.example.demo.configuration;

import com.example.demo.configuration.httpheaders.CorsHeaders;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@EnableWebSecurity
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final CorsHeaders corsHeaders;

    public SecurityConfig(CorsHeaders corsHeaders) {
        this.corsHeaders = corsHeaders;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                // Default is to use a CorsConfigurationSource bean (provided below).
                .cors();
        // We can do other header manipulation (such as CSP) here.
        http.csrf().disable();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", this.corsHeaders.getCorsConfiguration());
        return source;
    }
}