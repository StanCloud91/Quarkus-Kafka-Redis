package org.acme.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import org.acme.entity.User;
import org.acme.entity.Rol;
import at.favre.lib.crypto.bcrypt.BCrypt;

import java.util.List;

@ApplicationScoped
public class UserService {
    
    @Transactional
    public User crear(User user) {
        // Verificar que exista el rol
        Rol rol = Rol.findById(user.rol.id);
        if (rol != null) {
            // Encriptar la contraseña
            String hashedPassword = BCrypt.withDefaults().hashToString(12, user.password.toCharArray());
            user.password = hashedPassword;
            user.rol = rol;
            user.persist();
            return user;
        }
        return null;
    }
    
    public User obtenerPorId(Long id) {
        return User.findById(id);
    }
    
    public List<User> listarTodos() {
        return User.listAll();
    }
    
    public User obtenerPorUsername(String username) {
        return User.find("username", username).firstResult();
    }
    
    @Transactional
    public User actualizar(Long id, User user) {
        User existente = User.findById(id);
        if (existente != null) {
            // Verificar que exista el rol nuevo
            Rol rol = Rol.findById(user.rol.id);
            if (rol != null) {
                existente.username = user.username;
                // Solo actualizar la contraseña si se proporciona una nueva
                if (user.password != null && !user.password.isEmpty()) {
                    String hashedPassword = BCrypt.withDefaults().hashToString(12, user.password.toCharArray());
                    existente.password = hashedPassword;
                }
                existente.rol = rol;
                return existente;
            }
        }
        return null;
    }
    
    @Transactional
    public boolean eliminar(Long id) {
        return User.deleteById(id);
    }
    
    public boolean verificarCredenciales(String username, String password) {
        User user = obtenerPorUsername(username);
        if (user != null) {
            return BCrypt.verifyer().verify(password.toCharArray(), user.password.toCharArray()).verified;
        }
        return false;
    }
}
