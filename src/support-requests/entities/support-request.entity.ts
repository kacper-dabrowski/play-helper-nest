import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export class SupportRequest {
  @ObjectIdColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  department: string;

  @Column()
  content: string;
}

export const fakeSupportRequestEntity: SupportRequest = {
  id: 'some-id',
  title: 'My support request',
  department: 'Technical department',
  description: 'Some description',
  content:
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ',
};
