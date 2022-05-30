package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.boot.web.servlet.ServletComponentScan;

@SpringBootApplication
@ConfigurationPropertiesScan
@ServletComponentScan
public class HovedopgaveApplication {

	public static void main(String[] args) {
		SpringApplication.run(HovedopgaveApplication.class, args);
	}

}
