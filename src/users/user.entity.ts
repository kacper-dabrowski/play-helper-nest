import { Column, Entity, ObjectIdColumn, Unique } from 'typeorm';

@Entity()
@Unique(['username'])
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
