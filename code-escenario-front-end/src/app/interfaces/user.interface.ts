import { Rol } from './rol.interface';

export interface User {
    id?: number;
    username: string;
    password?: string;
    rol?: Rol;
    createdAt?: Date;
    updatedAt?: Date;
} 