import {
    Entity,
    Property,
    ManyToOne,
    OneToMany,
} from '@mikro-orm/core';

import { BaseEntity } from '../shared/db/BaseEntity.entity';
import {User} from '../user/user.entity';


// Saque el atributo categoryType porque no le encontre logica
// ya que todas van a ser texto plano

@Entity()
    export class Notification extends BaseEntity {
        @Property()
        NotificationId!: number;
        
        @Property()
        NotificationContent!: string;

        @Property()
        DateTimeNotification!: Date;

        @ManyToOne()
        User!: User;
        
    }

