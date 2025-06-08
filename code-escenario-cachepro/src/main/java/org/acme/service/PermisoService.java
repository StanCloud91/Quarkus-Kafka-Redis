package org.acme.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import org.acme.entity.Permiso;
import org.acme.entity.Rol;
import org.acme.entity.Endpoint;

import java.util.List;

@ApplicationScoped
public class PermisoService {
    
    @Transactional
    public Permiso crear(Permiso permiso) {
        // Verificar que existan el rol y el endpoint
        Rol rol = Rol.findById(permiso.rol.id);
        Endpoint endpoint = Endpoint.findById(permiso.endpoint.id);
        
        if (rol != null && endpoint != null) {
            permiso.rol = rol;
            permiso.endpoint = endpoint;
            permiso.persist();
            return permiso;
        }
        return null;
    }
    
    public Permiso obtenerPorId(Long id) {
        return Permiso.findById(id);
    }
    
    public List<Permiso> listarTodos() {
        return Permiso.listAll();
    }
    
    public List<Permiso> listarPorRol(Long rolId) {
        return Permiso.list("rol.id", rolId);
    }
    
    public List<Permiso> listarPorEndpoint(Long endpointId) {
        return Permiso.list("endpoint.id", endpointId);
    }
    
    @Transactional
    public Permiso actualizar(Long id, Permiso permiso) {
        Permiso existente = Permiso.findById(id);
        if (existente != null) {
            // Verificar que existan el rol y el endpoint nuevos
            Rol rol = Rol.findById(permiso.rol.id);
            Endpoint endpoint = Endpoint.findById(permiso.endpoint.id);
            
            if (rol != null && endpoint != null) {
                existente.rol = rol;
                existente.endpoint = endpoint;
                existente.listar = permiso.listar;
                existente.crear = permiso.crear;
                existente.actualizar = permiso.actualizar;
                existente.eliminar = permiso.eliminar;
                return existente;
            }
        }
        return null;
    }
    
    @Transactional
    public boolean eliminar(Long id) {
        return Permiso.deleteById(id);
    }
} 