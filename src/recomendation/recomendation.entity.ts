import {
    Entity,
    Property,
    ManyToOne,
    ManyToMany,
    Collection,
    
  } from '@mikro-orm/core';
import { BaseEntity } from "../shared/db/BaseEntity.entity.js";
import { User } from "../user/user.entity.js";
import { PlaceProduct } from '../placeProduct/placeProduct.entity.js';

@Entity()
    export class Recomendation extends BaseEntity {
        
      @Property({nullable: false})
      points!: number;

      @Property({nullable: false})
      description!: string;

      @ManyToOne()
      user!: User;

      @ManyToOne()
      placeProduct!: PlaceProduct;


    }