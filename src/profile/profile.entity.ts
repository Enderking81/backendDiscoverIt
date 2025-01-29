import {
    Entity,
    Property,
    ManyToOne,
    ManyToMany,
    Collection,
    OneToOne,
    
  } from '@mikro-orm/core';
import { BaseEntity } from "../shared/db/BaseEntity.entity.js";
import { User } from "../user/user.entity.js";


@Entity()
    export class Profile extends BaseEntity {
        
        @OneToOne('User', 'profile')
        user!: User;

        @Property({nullable: false})
        personalInformation!: string;

        @Property({nullable: false})
        profileImage!: string;

        @Property({nullable: false})
        privacySettings!: string;

         
    }

