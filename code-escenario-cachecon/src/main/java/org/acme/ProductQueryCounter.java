package org.acme;

import io.quarkus.redis.client.RedisClient;
import io.vertx.redis.client.Response;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.time.LocalDate;


@ApplicationScoped
public class ProductQueryCounter {

    @Inject
    RedisClient redisClient;

    private String getKey(String productId) {
        LocalDate today = LocalDate.now();
        return String.format("product:queries:%s:%s", productId, today);
    }

    public void incrementQueryCount(String productId) {
        String key = getKey(productId);
        redisClient.incrby(key, "1");
    }

    
} 