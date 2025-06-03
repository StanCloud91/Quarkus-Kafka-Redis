package org.acme;

import io.quarkus.redis.client.RedisClient;
import io.vertx.core.json.JsonObject;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.reactive.messaging.Incoming;

import java.util.List;

@ApplicationScoped
public class ProductConsumer {

    @Inject
    RedisClient redisClient;

    @Inject
    ProductQueryCounter queryCounter;

    @Incoming("products")
    public void consume(String productJson) {
        JsonObject product = new JsonObject(productJson);
        String productId = product.getString("id");
        
        // Almacenar en Redis
        redisClient.set(List.of("product:" + productId, productJson));

        // Incrementar el contador de consultas
        queryCounter.incrementQueryCount(productId);
    }
} 