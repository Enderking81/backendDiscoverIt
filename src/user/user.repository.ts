import { Repository } from "../shared/repository";
import { User } from "./user.entity.nosql";

// Array para almacenar los usuarios
const users: User[] = [];

export class UserRepository implements Repository<User> {
    // Devuelve todos los usuarios
    public findAll(): User[] {
        return users;
    }

    // Busca un usuario por su ID
    public findOne(item: { id: string }): User | undefined {
        return users.find(user => user.idUser === item.id);
    }

    // Agrega un usuario al array
    public add(item: User): User | undefined {
        users.push(item);
        return item;
    }

    // Actualiza un usuario existente en el array
    public update(item: User): User | undefined {
        const index = users.findIndex(user => user.idUser === item.idUser);
        if (index !== -1) {
            // El usuario no debe poder modificar el id
            users[index] = {...users[index], ...item, idUser: users[index].idUser}
            return users[index];
        }
        return undefined;
    }

    // Elimina un usuario del array
    public remove(item: { id: string }): User | undefined {
        const index = users.findIndex(user => user.idUser === item.id);
        if (index !== -1) {
            const deleted = users[index];
            users.splice(index, 1);
            return deleted;
        }
        return undefined;
    }

    // Busca un usuario por su ID
    public findById(id: string): User | undefined {
        return users.find(user => user.idUser === id);
    }
}