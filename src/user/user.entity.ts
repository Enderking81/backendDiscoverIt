import { Collection, Entity, ManyToMany, OneToMany, OneToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/BaseEntity.entity.js";
import { Category } from "../category/category.entity.js";
import { Profile } from "../profile/profile.entity.js";
import { Recomendation } from "../recomendation/recomendation.entity.js";
import { PlaceProduct } from "../placeProduct/placeProduct.entity.js";




@Entity()
    export class User extends BaseEntity {
        @Property({nullable: false, unique: true})
        name!: string
    
        @Property({nullable: false, unique: true})
        email!: string

        @Property({nullable: false})
        password!: string

        @Property({nullable: true})
        isAdmin?: boolean
        
        @Property({nullable: true})
        isSeller?: boolean

        @Property({nullable: true})
        rewardPoints?: number

        @OneToMany('Notification', 'user')
        notifications = new Collection<Notification>(this);
        
        @OneToMany('Category', 'user')
        categories = new Collection<Category>(this);
    
        @OneToOne() 
        profile?: Profile;

        @OneToMany('Recomendation', 'user')
        recomendations = new Collection<Recomendation>(this);

        @ManyToMany('PlaceProduct')
        favorites = new Collection<PlaceProduct>(this);//La lista de favoritos seria una collection de placeProduct
    }
