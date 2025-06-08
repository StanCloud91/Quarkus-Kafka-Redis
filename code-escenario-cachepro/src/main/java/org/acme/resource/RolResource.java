package org.acme.resource;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.acme.entity.Rol;
import org.acme.service.RolService;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;

@Path("/roles")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Roles", description = "Gestión de roles del sistema")
public class RolResource {

    @Inject
    RolService rolService;

    @POST
    @Operation(summary = "Crear rol", description = "Crea un nuevo rol en el sistema")
    @APIResponses(value = {
        @APIResponse(responseCode = "201", description = "Rol creado exitosamente",
            content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = Rol.class))),
        @APIResponse(responseCode = "400", description = "Datos inválidos")
    })
    public Response crear(Rol rol) {
        Rol creado = rolService.crear(rol);
        return Response.status(Response.Status.CREATED).entity(creado).build();
    }

    @GET
    @Path("/{id}")
    @Operation(summary = "Obtener rol", description = "Obtiene un rol por su ID")
    @APIResponses(value = {
        @APIResponse(responseCode = "200", description = "Rol encontrado",
            content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = Rol.class))),
        @APIResponse(responseCode = "404", description = "Rol no encontrado")
    })
    public Response obtenerPorId(@PathParam("id") Long id) {
        Rol rol = rolService.obtenerPorId(id);
        if (rol != null) {
            return Response.ok(rol).build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }

    @GET
    @Operation(summary = "Listar roles", description = "Obtiene la lista de todos los roles")
    @APIResponse(responseCode = "200", description = "Lista de roles",
        content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = Rol.class)))
    public List<Rol> listarTodos() {
        return rolService.listarTodos();
    }

    @PUT
    @Path("/{id}")
    @Operation(summary = "Actualizar rol", description = "Actualiza un rol existente")
    @APIResponses(value = {
        @APIResponse(responseCode = "200", description = "Rol actualizado exitosamente",
            content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = Rol.class))),
        @APIResponse(responseCode = "404", description = "Rol no encontrado")
    })
    public Response actualizar(@PathParam("id") Long id, Rol rol) {
        Rol actualizado = rolService.actualizar(id, rol);
        if (actualizado != null) {
            return Response.ok(actualizado).build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }

    @DELETE
    @Path("/{id}")
    @Operation(summary = "Eliminar rol", description = "Elimina un rol existente")
    @APIResponses(value = {
        @APIResponse(responseCode = "204", description = "Rol eliminado exitosamente"),
        @APIResponse(responseCode = "404", description = "Rol no encontrado")
    })
    public Response eliminar(@PathParam("id") Long id) {
        boolean eliminado = rolService.eliminar(id);
        if (eliminado) {
            return Response.noContent().build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }
} 