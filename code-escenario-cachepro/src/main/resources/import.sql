-- Crear rol admin
INSERT INTO roles (id, name, estado) VALUES (1, 'admin', true);

-- Crear usuario admin con contraseña admin123 (hash BCrypt)
INSERT INTO users (id, username, password, rol_id) VALUES (1, 'admin', '$2a$12$8qx5ZWRzh3OZEQOVZImQxOYz6TtxMQJqhN.dHE5YJpxXxsZ7w6OLe', 1);

-- Crear endpoint de productos
INSERT INTO endpoints (id, name, path, descripcion) VALUES (1, 'Productos', '/products', 'Endpoint para gestión de productos');

-- Crear permisos para el rol admin sobre productos
INSERT INTO permisos (id, rol_id, endpoint_id, listar, crear, actualizar, eliminar) VALUES (1, 1, 1, true, true, true, true); 