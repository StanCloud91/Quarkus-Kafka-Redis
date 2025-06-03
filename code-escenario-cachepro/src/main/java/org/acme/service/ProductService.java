package org.acme.service;

import io.quarkus.redis.client.RedisClient;
import io.vertx.core.json.JsonObject;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.acme.entity.Product;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;
import io.vertx.redis.client.Response;
import java.time.LocalDate;

import java.util.List;

@ApplicationScoped
public class ProductService {

    @Inject
    RedisClient redisClient;

    @Inject
    @Channel("products")
    Emitter<String> productEmitter;

    @Transactional
    public Product createProduct(Product product) {
        product.persist();
        //String productJson = JsonObject.mapFrom(product).encode();
        //productEmitter.send(productJson);
        return product;
    }

    public Product getProduct(Long id) {
        // Primero intentamos obtener el producto de Redis
        Response response = redisClient.get(getRedisKey(id));
        String productJson = "";
                
        if (response != null) {
            productJson = redisClient.get(getRedisKey(id)).toString();
            incrementQueryCount(id);
            return JsonObject.mapFrom(new JsonObject(productJson)).mapTo(Product.class);
        }

        // Si no está en Redis, lo buscamos en la base de datos
        Product product = Product.findById(id);
        if (product != null) {
            // Lo guardamos en Redis para futuras consultas
            productJson = JsonObject.mapFrom(product).encode();
            // Almacenar en Redis
            //redisClient.set(List.of(getRedisKey(id), productJson));
            // Enviamos el producto a Kafka
            productEmitter.send(productJson);
        }
        return product;
    }

    public Product getProductRedis(Long id) {
        // Primero intentamos obtener el producto de Redis
        Response response = redisClient.get(getRedisKey(id));
        
        
        if (response != null) {
            String productJson = redisClient.get(getRedisKey(id)).toString();
            return JsonObject.mapFrom(new JsonObject(productJson)).mapTo(Product.class);
        }
        // Si no está en Redis, lo buscamos en la base de datos
        Product product = new Product();
        return product;
    }
    public void incrementQueryCount(Long id) {
        String key = getKey(id.toString());
        redisClient.incrby(key, "1");
    }

    public Long getQueryCount(Long id ) {
        String key = getKey(id.toString());
        Response response = redisClient.get(key);
        return response != null ? Long.parseLong(response.toString()) : 0L;
    }

    private String getKey(String productId) {
        LocalDate today = LocalDate.now();
        return String.format("product:queries:%s:%s", productId, today);
    }

    @Transactional
    public Product updateProduct(Long id, Product product) {
        Product existingProduct = Product.findById(id);
        if (existingProduct != null) {
            existingProduct.name = product.name;
            existingProduct.description = product.description;
            existingProduct.price = product.price;
            existingProduct.stock = product.stock;
            
            // Actualizamos Redis
            String productJson = JsonObject.mapFrom(existingProduct).encode();
            //redisClient.set(List.of(getRedisKey(id), productJson));
            
            // Enviamos la actualización a Kafka
            productEmitter.send(productJson);
        }
        return existingProduct;
    }

    @Transactional
    public boolean deleteProduct(Long id) {
        Product product = Product.findById(id);
        if (product != null) {
            // Eliminamos de Redis
            redisClient.del(List.of(getRedisKey(id)));
            // Eliminamos de la base de datos
            product.delete();
            return true;
        }
        return false;
    }

    public List<Product> getAllProducts() {
        return Product.listAll();
    }

    private String getRedisKey(Long id) {
        return "product:" + id;
    }
} 