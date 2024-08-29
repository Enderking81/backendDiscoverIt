export interface Repository<T> {
    findAll(): T[] | undefined; // Retorna todas las entidades
    findById(id: string): T | undefined; // Retorna la entidad con el id dado
    add(item: T): T | undefined; // agrega una entidad
    update(item: T): T | undefined; // actualiza una entidad
    remove(item: {id: string}): T | undefined; // elimina una entidad
}
