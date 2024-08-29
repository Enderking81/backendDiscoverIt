import {
    Entity,
    Property,
    ManyToOne,
    ManyToMany,
    Collection,
    
  } from '@mikro-orm/core';
import { BaseEntity } from "../shared/db/BaseEntity.entity.js";
import { Category } from "../category/category.entity.js";

  @Entity()
    export class PlaceProduct extends BaseEntity {
        @Property()   
        name!: string
        
        @Property()
        description!: string
        
        @Property()
        location!: string

        @Property()
        type!: string

        @Property()
        logo!: string

        @Property()
        openingsHours!: string

        @Property()
        avaregeRating!: number

        @Property()
        images!: string 
    
        @ManyToOne(() => Category)
        category!: Category;    

    }
