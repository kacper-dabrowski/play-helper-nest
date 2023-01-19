import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export class SupportRequest {
  @ObjectIdColumn()
  id: string;

  @Column()
  description: string;

  @Column()
  department: string;

  @Column()
  content: string;
}
