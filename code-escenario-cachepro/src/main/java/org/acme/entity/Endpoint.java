package org.acme.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "endpoints")
public class Endpoint extends PanacheEntity {
    
    @Column(name = "name", nullable = false, length = 100)
    public String name;
    
    @Column(name = "path", nullable = false, length = 255)
    public String path;
    
    @Column(name = "descripcion", columnDefinition = "TEXT")
    public String descripcion;
} 