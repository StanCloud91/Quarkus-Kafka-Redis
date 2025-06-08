package org.acme.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "permisos")
public class Permiso extends PanacheEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rol_id", nullable = false)
    public Rol rol;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "endpoint_id", nullable = false)
    public Endpoint endpoint;
    
    @Column(name = "listar", nullable = false)
    public Boolean listar;
    
    @Column(name = "crear", nullable = false)
    public Boolean crear;
    
    @Column(name = "actualizar", nullable = false)
    public Boolean actualizar;
    
    @Column(name = "eliminar", nullable = false)
    public Boolean eliminar;
    
    // Constructor por defecto
    public Permiso() {
        this.listar = false;
        this.crear = false;
        this.actualizar = false;
        this.eliminar = false;
    }

    @Override
    public String toString() {
        return "Permiso{" +
                "rol='" + rol + '\'' +
                ", endpoint='" + endpoint + '\'' +
                ", listar=" + listar +
                ", crear=" + crear +
                ", actualizar=" + actualizar +
                ", eliminar=" + eliminar +
                '}';
    }
} 