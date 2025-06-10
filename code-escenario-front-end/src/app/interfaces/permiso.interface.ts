import { Rol } from './rol.interface';
import { Endpoint } from './endpoint.interface';

export interface Permiso {
    id?: number;
    rol: Rol;
    endpoint: Endpoint;
    crear: boolean;
    listar: boolean;
    actualizar: boolean;
    eliminar: boolean;
    createdAt?: Date;
    updatedAt?: Date;
} 