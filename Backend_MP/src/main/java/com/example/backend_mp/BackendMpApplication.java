package com.example.backend_mp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableAsync
@EnableScheduling
@EnableAspectJAutoProxy
public class BackendMpApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendMpApplication.class, args);
    }

}
