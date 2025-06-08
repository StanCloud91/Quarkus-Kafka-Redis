package org.acme.service;
import jakarta.enterprise.context.ApplicationScoped;
import org.acme.entity.Permiso;
import org.acme.entity.Rol;
import org.acme.entity.Endpoint;
import java.util.logging.Logger;
import java.util.logging.Level;

@ApplicationScoped
public class PermisosDinamicosService {
    
    private static final Logger LOGGER = Logger.getLogger(PermisosDinamicosService.class.getName());
    
    public boolean tienePermiso(String rolId, String endpointPath, String accion) {
        LOGGER.info("Verificando permiso para rolId: " + rolId + ", endpointPath: " + endpointPath + ", accion: " + accion);
        
        try {

            Rol rol = Rol.find("name = ?1", rolId).firstResult();
            if (rol == null) {
                LOGGER.warning("Rol no encontrado con ID: " + rolId);
                return false;
            }
            LOGGER.info("Rol encontrado con ID: " + rol.id);
            
            // Buscar el endpoint que coincida con el path
            String pathBase = endpointPath.split("\\?")[0]; // Remover query params
            pathBase = pathBase.replaceAll("/+$", ""); // Remover trailing slashes
            
            LOGGER.info("Buscando endpoint para path: " + pathBase);
            
            Endpoint endpoint = Endpoint.find("path = ?1", pathBase).firstResult();
            if (endpoint == null) {
                LOGGER.warning("Endpoint no encontrado para path: " + pathBase);
                return false;
            }
            LOGGER.info("Endpoint encontrado con ID: " + endpoint.id);
            
            // Buscar el permiso
            LOGGER.info("Buscando permiso para rol " + rol.id + " y endpoint " + endpoint.id);
            
            Permiso permiso = Permiso.find("rol.id = ?1 and endpoint.id = ?2", 
                rol.id, endpoint.id).firstResult();
            
            if (permiso == null) {
                LOGGER.warning("Permiso no encontrado para rol " + rol.id + " y endpoint " + endpoint.id);
                return false;
            }
            
            boolean resultado = switch (accion.toLowerCase()) {
                case "listar" -> permiso.listar;
                case "crear" -> permiso.crear;
                case "actualizar" -> permiso.actualizar;
                case "eliminar" -> permiso.eliminar;
                default -> false;
            };
            
            LOGGER.info("Resultado de verificación de permiso: " + resultado);
            return resultado;
            
        } catch (NumberFormatException e) {
            LOGGER.log(Level.SEVERE, "Error al parsear ID de rol: " + rolId, e);
            return false;
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error inesperado al verificar permisos", e);
            return false;
        }
    }
}
