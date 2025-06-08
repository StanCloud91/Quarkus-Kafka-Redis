package org.acme.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import org.acme.entity.Endpoint;

import java.util.List;

@ApplicationScoped
public class EndpointService {
    
    @Transactional
    public Endpoint crear(Endpoint endpoint) {
        endpoint.persist();
        return endpoint;
    }
    
    public Endpoint obtenerPorId(Long id) {
        return Endpoint.findById(id);
    }
    
    public List<Endpoint> listarTodos() {
        return Endpoint.listAll();
    }
    
    @Transactional
    public Endpoint actualizar(Long id, Endpoint endpoint) {
        Endpoint existente = Endpoint.findById(id);
        if (existente != null) {
            existente.name = endpoint.name;
            existente.path = endpoint.path;
            existente.descripcion = endpoint.descripcion;
            return existente;
        }
        return null;
    }
    
    @Transactional
    public boolean eliminar(Long id) {
        return Endpoint.deleteById(id);
    }
} 