package org.acme.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.*;

@Entity
public class User extends PanacheEntity {
    
    @Column(name = "username", nullable = false, unique = true)
    public String username;
    
    @Column(name = "password", nullable = false)
    public String password;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rol_id", nullable = false)
    public Rol rol;

    // Constructor por defecto
    public User() {
    }
    // Constructor con parámetros
    public User(String username, String password, Long rolId) {
        this.username = username;
        this.password = password;
        this.rol = Rol.findById(rolId);
    }

    public String getRol() {
        return rol.name;
    }
}