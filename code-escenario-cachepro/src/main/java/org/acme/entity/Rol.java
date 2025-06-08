package org.acme.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "roles")
public class Rol extends PanacheEntity {
    
    @Column(name = "name", nullable = false, length = 50)
    public String name;
    
    @Column(name = "estado", nullable = false)
    public Boolean estado;
} 