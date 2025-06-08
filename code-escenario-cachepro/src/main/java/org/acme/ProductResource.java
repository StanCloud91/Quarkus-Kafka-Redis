package org.acme;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.acme.entity.Product;
import org.acme.service.ProductService;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import io.quarkus.security.identity.SecurityIdentity;
import org.acme.service.PermisosDinamicosService;
import io.quarkus.security.Authenticated;
import java.util.List;
import java.util.logging.Logger;

@Path("/products")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Productos", description = "Operaciones sobre productos")
@Authenticated
public class ProductResource {

    private static final Logger LOGGER = Logger.getLogger(ProductResource.class.getName());
    private static final String ENDPOINT_PATH = "/products";

    @Inject
    SecurityIdentity identity;

    @Inject
    PermisosDinamicosService permisoService;

    @Inject
    ProductService productService;

    @POST
    @Operation(summary = "Crear producto", description = "Crea un nuevo producto en la base de datos")
    @APIResponses(value = {
        @APIResponse(responseCode = "201", description = "Producto creado exitosamente",
            content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = Product.class))),
        @APIResponse(responseCode = "400", description = "Datos de producto inválidos")
    })
    public Response createProduct(Product product) {
        if (!tieneAcceso("crear")) {
            throw new NotAuthorizedException("No tienes permisos para crear productos");
        }
        Product created = productService.createProduct(product);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @GET
    @Path("/{id}")
    @Operation(summary = "Obtener producto", description = "Obtiene un producto por su ID, primero buscando en caché Redis y luego en base de datos")
    @APIResponses(value = {
        @APIResponse(responseCode = "200", description = "Producto encontrado",
            content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = Product.class))),
        @APIResponse(responseCode = "404", description = "Producto no encontrado")
    })
    public Response getProduct(@PathParam("id") Long id) {
        if (!tieneAcceso("listar")) {
            throw new NotAuthorizedException("No tienes permisos para ver productos");
        }
        Product product = productService.getProduct(id);
        if (product != null) {
            return Response.ok(product).build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }

    @GET
    @Path("/counter/{id}")
    @Operation(summary = "Obtener contador de consultas", description = "Retorna el número de veces que se ha consultado un producto específico")
    @APIResponses(value = {
        @APIResponse(responseCode = "200", description = "Contador encontrado",
            content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = Long.class))),
        @APIResponse(responseCode = "404", description = "Contador no encontrado")
    })
    public Response getProductCounter(@PathParam("id") Long id) {
        if (!tieneAcceso("listar")) {
            throw new NotAuthorizedException("No tienes permisos para ver contadores");
        }
        Long count = productService.getQueryCount(id);
        if (count != null) {
            return Response.ok(count).build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }

    @GET
    @Path("/redis/{id}")
    @Operation(summary = "Obtener producto de Redis", description = "Obtiene un producto directamente desde la caché Redis")
    @APIResponses(value = {
        @APIResponse(responseCode = "200", description = "Producto encontrado en Redis",
            content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = Product.class))),
        @APIResponse(responseCode = "404", description = "Producto no encontrado en Redis")
    })
    public Response getProductRedis(@PathParam("id") Long id) {
        if (!tieneAcceso("listar")) {
            throw new NotAuthorizedException("No tienes permisos para ver productos");
        }
        Product product = productService.getProductRedis(id);
        if (product != null) {
            return Response.ok(product).build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }

    @GET
    @Operation(
        summary = "Listar productos",
        description = "Retorna la lista de productos desde la caché Redis o la base de datos"
    )
    @APIResponses({
        @APIResponse(
            responseCode = "200",
            description = "Lista de productos obtenida exitosamente",
            content = @Content(mediaType = MediaType.APPLICATION_JSON)
        ),
        @APIResponse(
            responseCode = "401",
            description = "No autorizado"
        )
    })
    public Response list() {
        LOGGER.info("Verificando permisos para listar productos");
        LOGGER.info("Grupos del usuario: " + identity.getAttribute("groups"));
        
        if (!tieneAcceso("LISTAR")) {
            LOGGER.warning("Usuario no tiene permisos para listar productos");
            throw new NotAuthorizedException("No tienes permisos para ver productos");
        }
        
        List<Product> products = productService.getAllProducts();
        return Response.ok(products).build();
    }

    @PUT
    @Path("/{id}")
    @Operation(summary = "Actualizar producto", description = "Actualiza un producto existente y su caché en Redis")
    @APIResponses(value = {
        @APIResponse(responseCode = "200", description = "Producto actualizado exitosamente",
            content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = Product.class))),
        @APIResponse(responseCode = "404", description = "Producto no encontrado")
    })
    public Response updateProduct(@PathParam("id") Long id, Product product) {
        if (!tieneAcceso("actualizar")) {
            throw new NotAuthorizedException("No tienes permisos para actualizar productos");
        }
        Product updated = productService.updateProduct(id, product);
        if (updated != null) {
            return Response.ok(updated).build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }

    @DELETE
    @Path("/{id}")
    @Operation(summary = "Eliminar producto", description = "Elimina un producto tanto de la base de datos como de Redis")
    @APIResponses(value = {
        @APIResponse(responseCode = "204", description = "Producto eliminado exitosamente"),
        @APIResponse(responseCode = "404", description = "Producto no encontrado")
    })
    public Response deleteProduct(@PathParam("id") Long id) {
        if (!tieneAcceso("eliminar")) {
            throw new NotAuthorizedException("No tienes permisos para eliminar productos");
        }
        boolean deleted = productService.deleteProduct(id);
        if (deleted) {
            return Response.noContent().build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }

    private boolean tieneAcceso(String accion) {
        return identity.getRoles().stream().anyMatch(rol ->{
            LOGGER.info("Rol " + rol + " tiene permiso " + accion );
            return permisoService.tienePermiso(rol, ENDPOINT_PATH, accion);
        });
    }
} 