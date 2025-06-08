package org.acme.resource;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.acme.entity.Endpoint;
import org.acme.service.EndpointService;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;

@Path("/endpoints")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Endpoints", description = "Gestión de endpoints del sistema")
public class EndpointResource {

    @Inject
    EndpointService endpointService;

    @POST
    @Operation(summary = "Crear endpoint", description = "Crea un nuevo endpoint en el sistema")
    @APIResponses(value = {
        @APIResponse(responseCode = "201", description = "Endpoint creado exitosamente",
            content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = Endpoint.class))),
        @APIResponse(responseCode = "400", description = "Datos inválidos")
    })
    public Response crear(Endpoint endpoint) {
        Endpoint creado = endpointService.crear(endpoint);
        return Response.status(Response.Status.CREATED).entity(creado).build();
    }

    @GET
    @Path("/{id}")
    @Operation(summary = "Obtener endpoint", description = "Obtiene un endpoint por su ID")
    @APIResponses(value = {
        @APIResponse(responseCode = "200", description = "Endpoint encontrado",
            content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = Endpoint.class))),
        @APIResponse(responseCode = "404", description = "Endpoint no encontrado")
    })
    public Response obtenerPorId(@PathParam("id") Long id) {
        Endpoint endpoint = endpointService.obtenerPorId(id);
        if (endpoint != null) {
            return Response.ok(endpoint).build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }

    @GET
    @Operation(summary = "Listar endpoints", description = "Obtiene la lista de todos los endpoints")
    @APIResponse(responseCode = "200", description = "Lista de endpoints",
        content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = Endpoint.class)))
    public List<Endpoint> listarTodos() {
        return endpointService.listarTodos();
    }

    @PUT
    @Path("/{id}")
    @Operation(summary = "Actualizar endpoint", description = "Actualiza un endpoint existente")
    @APIResponses(value = {
        @APIResponse(responseCode = "200", description = "Endpoint actualizado exitosamente",
            content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = Endpoint.class))),
        @APIResponse(responseCode = "404", description = "Endpoint no encontrado")
    })
    public Response actualizar(@PathParam("id") Long id, Endpoint endpoint) {
        Endpoint actualizado = endpointService.actualizar(id, endpoint);
        if (actualizado != null) {
            return Response.ok(actualizado).build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }

    @DELETE
    @Path("/{id}")
    @Operation(summary = "Eliminar endpoint", description = "Elimina un endpoint existente")
    @APIResponses(value = {
        @APIResponse(responseCode = "204", description = "Endpoint eliminado exitosamente"),
        @APIResponse(responseCode = "404", description = "Endpoint no encontrado")
    })
    public Response eliminar(@PathParam("id") Long id) {
        boolean eliminado = endpointService.eliminar(id);
        if (eliminado) {
            return Response.noContent().build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }
} 