import {
    Entity,
    Property,
    PrimaryKey,
    OneToMany,
    Collection,
  } from '@mikro-orm/core';
  import { BaseEntity } from "../shared/db/BaseEntity.entity.js";
import { PlaceProduct } from '../placeProduct/placeProduct.entity.js';



@Entity()
export class Category extends BaseEntity {
    @Property()   
    name!: string
    
    @Property()
    description!: string

    @OneToMany('PlaceProduct', 'category')
    placeProducts = new Collection<PlaceProduct>(this);  // Inicialización de la colección
}
    


