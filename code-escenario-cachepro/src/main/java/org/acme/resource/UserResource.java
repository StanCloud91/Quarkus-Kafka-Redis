package org.acme.resource;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.acme.entity.User;
import org.acme.service.UserService;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;

@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Usuarios", description = "Gestión de usuarios del sistema")
public class UserResource {

    @Inject
    UserService userService;

    @POST
    @Operation(summary = "Crear usuario", description = "Crea un nuevo usuario en el sistema")
    @APIResponses(value = {
        @APIResponse(responseCode = "201", description = "Usuario creado exitosamente",
            content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = User.class))),
        @APIResponse(responseCode = "400", description = "Datos inválidos"),
        @APIResponse(responseCode = "404", description = "Rol no encontrado")
    })
    public Response crear(User user) {
        User creado = userService.crear(user);
        if (creado != null) {
            return Response.status(Response.Status.CREATED).entity(creado).build();
        }
        return Response.status(Response.Status.NOT_FOUND)
            .entity("Rol no encontrado").build();
    }

    @GET
    @Path("/{id}")
    @Operation(summary = "Obtener usuario", description = "Obtiene un usuario por su ID")
    @APIResponses(value = {
        @APIResponse(responseCode = "200", description = "Usuario encontrado",
            content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = User.class))),
        @APIResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    public Response obtenerPorId(@PathParam("id") Long id) {
        User user = userService.obtenerPorId(id);
        if (user != null) {
            return Response.ok(user).build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }

    @GET
    @Operation(summary = "Listar usuarios", description = "Obtiene la lista de todos los usuarios")
    @APIResponse(responseCode = "200", description = "Lista de usuarios",
        content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = User.class)))
    public List<User> listarTodos() {
        return userService.listarTodos();
    }

    @GET
    @Path("/username/{username}")
    @Operation(summary = "Obtener usuario por username", description = "Obtiene un usuario por su nombre de usuario")
    @APIResponses(value = {
        @APIResponse(responseCode = "200", description = "Usuario encontrado",
            content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = User.class))),
        @APIResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    public Response obtenerPorUsername(@PathParam("username") String username) {
        User user = userService.obtenerPorUsername(username);
        if (user != null) {
            return Response.ok(user).build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }

    @PUT
    @Path("/{id}")
    @Operation(summary = "Actualizar usuario", description = "Actualiza un usuario existente")
    @APIResponses(value = {
        @APIResponse(responseCode = "200", description = "Usuario actualizado exitosamente",
            content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = User.class))),
        @APIResponse(responseCode = "404", description = "Usuario o Rol no encontrado")
    })
    public Response actualizar(@PathParam("id") Long id, User user) {
        User actualizado = userService.actualizar(id, user);
        if (actualizado != null) {
            return Response.ok(actualizado).build();
        }
        return Response.status(Response.Status.NOT_FOUND)
            .entity("Usuario o Rol no encontrado").build();
    }

    @DELETE
    @Path("/{id}")
    @Operation(summary = "Eliminar usuario", description = "Elimina un usuario existente")
    @APIResponses(value = {
        @APIResponse(responseCode = "204", description = "Usuario eliminado exitosamente"),
        @APIResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    public Response eliminar(@PathParam("id") Long id) {
        boolean eliminado = userService.eliminar(id);
        if (eliminado) {
            return Response.noContent().build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }
}