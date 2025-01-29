import { Entity, PrimaryKey } from "@mikro-orm/core";

@Entity()
export abstract class BaseEntity {
    @PrimaryKey()
    id?: number  




}