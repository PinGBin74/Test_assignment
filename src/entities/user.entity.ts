import {
  Entity,
  PrimaryGeneratedColumn,
  Column as ColumnType,
  OneToMany,
} from 'typeorm';
import { ColumnEntity } from './column.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ColumnType({ unique: true, length: 256 })
  email: string;

  @ColumnType({ length: 255 })
  password: string;

  @ColumnType({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => ColumnEntity, (column: ColumnEntity) => column.user)
  columns: ColumnEntity[];
}
