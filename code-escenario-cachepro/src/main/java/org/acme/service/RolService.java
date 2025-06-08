package org.acme.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import org.acme.entity.Rol;

import java.util.List;

@ApplicationScoped
public class RolService {
    
    @Transactional
    public Rol crear(Rol rol) {
        rol.persist();
        return rol;
    }
    
    public Rol obtenerPorId(Long id) {
        return Rol.findById(id);
    }
    
    public List<Rol> listarTodos() {
        return Rol.listAll();
    }
    
    @Transactional
    public Rol actualizar(Long id, Rol rol) {
        Rol existente = Rol.findById(id);
        if (existente != null) {
            existente.name = rol.name;
            existente.estado = rol.estado;
            return existente;
        }
        return null;
    }
    
    @Transactional
    public boolean eliminar(Long id) {
        return Rol.deleteById(id);
    }
} 