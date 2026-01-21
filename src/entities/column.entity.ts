import {
  Entity,
  PrimaryGeneratedColumn,
  Column as ColumnType,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Card } from './card.entity';

@Entity('columns')
export class ColumnEntity {
  // Alias for backward compatibility
  static get Column() {
    return ColumnEntity;
  }
  @PrimaryGeneratedColumn()
  id: number;

  @ColumnType({ length: 256 })
  title: string;

  @ColumnType({ type: 'integer' })
  position: number;

  @ColumnType()
  userId: number;

  @ColumnType({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.columns)
  user: User;

  @OneToMany(() => Card, (card) => card.column)
  cards: Card[];
}
