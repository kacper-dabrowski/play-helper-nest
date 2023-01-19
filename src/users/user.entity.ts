import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  ObjectIdColumn,
  OneToMany,
} from 'typeorm';
import { SupportRequest } from '../support-requests/entities/support-request.entity';

@Entity()
export class User {
  @ObjectIdColumn()
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column()
  startingPage: string;
}
