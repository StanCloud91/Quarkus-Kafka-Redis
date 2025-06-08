package org.acme.resource;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.acme.entity.Permiso;
import org.acme.service.PermisoService;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;

@Path("/permisos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Permisos", description = "Gestión de permisos del sistema")
public class PermisoResource {

    @Inject
    PermisoService permisoService;

    @POST
    @Operation(summary = "Crear permiso", description = "Crea un nuevo permiso en el sistema")
    @APIResponses(value = {
        @APIResponse(responseCode = "201", description = "Permiso creado exitosamente",
            content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = Permiso.class))),
        @APIResponse(responseCode = "400", description = "Datos inválidos"),
        @APIResponse(responseCode = "404", description = "Rol o Endpoint no encontrado")
    })
    public Response crear(Permiso permiso) {
        Permiso creado = permisoService.crear(permiso);
        if (creado != null) {
            return Response.status(Response.Status.CREATED).entity(creado).build();
        }
        return Response.status(Response.Status.NOT_FOUND)
            .entity("Rol o Endpoint no encontrado").build();
    }

    @GET
    @Path("/{id}")
    @Operation(summary = "Obtener permiso", description = "Obtiene un permiso por su ID")
    @APIResponses(value = {
        @APIResponse(responseCode = "200", description = "Permiso encontrado",
            content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = Permiso.class))),
        @APIResponse(responseCode = "404", description = "Permiso no encontrado")
    })
    public Response obtenerPorId(@PathParam("id") Long id) {
        Permiso permiso = permisoService.obtenerPorId(id);
        if (permiso != null) {
            return Response.ok(permiso).build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }

    @GET
    @Operation(summary = "Listar permisos", description = "Obtiene la lista de todos los permisos")
    @APIResponse(responseCode = "200", description = "Lista de permisos",
        content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = Permiso.class)))
    public List<Permiso> listarTodos() {
        return permisoService.listarTodos();
    }

    @GET
    @Path("/rol/{rolId}")
    @Operation(summary = "Listar permisos por rol", description = "Obtiene la lista de permisos de un rol específico")
    @APIResponse(responseCode = "200", description = "Lista de permisos del rol",
        content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = Permiso.class)))
    public List<Permiso> listarPorRol(@PathParam("rolId") Long rolId) {
        return permisoService.listarPorRol(rolId);
    }

    @GET
    @Path("/endpoint/{endpointId}")
    @Operation(summary = "Listar permisos por endpoint", description = "Obtiene la lista de permisos de un endpoint específico")
    @APIResponse(responseCode = "200", description = "Lista de permisos del endpoint",
        content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = Permiso.class)))
    public List<Permiso> listarPorEndpoint(@PathParam("endpointId") Long endpointId) {
        return permisoService.listarPorEndpoint(endpointId);
    }

    @PUT
    @Path("/{id}")
    @Operation(summary = "Actualizar permiso", description = "Actualiza un permiso existente")
    @APIResponses(value = {
        @APIResponse(responseCode = "200", description = "Permiso actualizado exitosamente",
            content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = Permiso.class))),
        @APIResponse(responseCode = "404", description = "Permiso, Rol o Endpoint no encontrado")
    })
    public Response actualizar(@PathParam("id") Long id, Permiso permiso) {
        Permiso actualizado = permisoService.actualizar(id, permiso);
        if (actualizado != null) {
            return Response.ok(actualizado).build();
        }
        return Response.status(Response.Status.NOT_FOUND)
            .entity("Permiso, Rol o Endpoint no encontrado").build();
    }

    @DELETE
    @Path("/{id}")
    @Operation(summary = "Eliminar permiso", description = "Elimina un permiso existente")
    @APIResponses(value = {
        @APIResponse(responseCode = "204", description = "Permiso eliminado exitosamente"),
        @APIResponse(responseCode = "404", description = "Permiso no encontrado")
    })
    public Response eliminar(@PathParam("id") Long id) {
        boolean eliminado = permisoService.eliminar(id);
        if (eliminado) {
            return Response.noContent().build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }
} 