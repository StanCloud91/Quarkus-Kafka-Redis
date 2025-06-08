package org.acme;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.acme.entity.User;
import io.smallrye.jwt.build.Jwt;
import java.time.Instant;
import java.util.Set;
import java.util.Map;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.eclipse.microprofile.openapi.annotations.Operation;
import jakarta.inject.Inject;
import org.acme.service.UserService;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import java.util.logging.Logger;

@Path("/auth")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "Authentication", description = "Endpoints para autenticación y generación de JWT")
public class AuthResource {
    
    private static final Logger LOGGER = Logger.getLogger(AuthResource.class.getName());
    
    @Inject
    UserService userService;
    //mp.jwt.verify.issuer
    @ConfigProperty(name = "mp.jwt.verify.issuer")
    String issuer;

    @POST
    @Path("/login")
    @Operation(
        summary = "Autenticar usuario",
        description = "Retorna un token JWT si las credenciales son válidas"
    )
    public Response login(User credentials) {
        LOGGER.info("Intento de login para usuario: " + credentials.username);
        
        User user = User.find("username", credentials.username).firstResult();
        if (user == null || !userService.verificarCredenciales(credentials.username, credentials.password)) {
            LOGGER.warning("Credenciales inválidas para usuario: " + credentials.username);
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
        
        LOGGER.info("Login exitoso para usuario: " + credentials.username + " con rol ID: " + user.rol.id);
        String token = generateToken(user.username, user.getRol());
        return Response.ok(Map.of("token", token)).build();
    }

    private String generateToken(String username, String role) {
        LOGGER.info("Generando token para usuario: " + username + " con rol: " + role);
        
        String token = Jwt.claims()
                .subject(username)
                .groups(role)
                .issuer("amazon-jwt")
                .expiresAt(Instant.now().plusSeconds(3600))
                .sign();
                
        LOGGER.info("Token generado exitosamente");
        return token;
    }
}
