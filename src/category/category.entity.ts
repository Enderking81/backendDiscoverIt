import {
    Entity,
    Property,
    PrimaryKey,
    OneToMany,
    Collection,
    ManyToOne,
    ManyToMany,
  } from '@mikro-orm/core';
import { BaseEntity } from "../shared/db/BaseEntity.entity.js";
import { PlaceProduct } from '../placeProduct/placeProduct.entity.js';
import { User } from '../user/user.entity.js';


@Entity()
export class Category extends BaseEntity {
    @Property({nullable: false})   
    name!: string
    
    @Property({nullable: false})
    description!: string

    @ManyToMany('PlaceProduct', 'categories')
    placeProducts = new Collection<PlaceProduct>(this);  // Inicialización de la colección

    @ManyToOne('User', {nullable: false})
    user!: User;

}
    


