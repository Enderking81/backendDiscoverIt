import {
    Entity,
    Property,
    ManyToOne,
    ManyToMany,
    Collection,
    OneToMany,
  } from '@mikro-orm/core';
import { BaseEntity } from "../shared/db/BaseEntity.entity.js";
import { Category } from "../category/category.entity.js";
import { Recomendation } from '../recomendation/recomendation.entity.js';

  @Entity()
    export class PlaceProduct extends BaseEntity {
        @Property({ nullable: false})   
        name!: string
        
        @Property({nullable: false})
        description!: string

        @Property({nullable: false})
        logo!: string
    
        @Property({nullable: true})
        location!: string
    
        @Property({nullable: false})
        type!: string
    
        @Property({nullable: true})
        openingHours!: string
    
        @Property({nullable: true})
        averageRating!: number
    
        @Property({nullable: true})
        images!: string
    
        @ManyToMany('Category', 'placeProducts', {owner: true}) //lo puedo dejar asi porque es el owner
        categories = new Collection<Category>(this); // Inicialización de la colección ya que placeproduct debe tener una lista de categorias

        @OneToMany('Recomendation', 'placeProduct')
        recomendations = new Collection<Recomendation>(this)
    }
  