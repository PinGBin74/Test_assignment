import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ColumnEntity } from './column.entity';
import { Comment } from './comment.entity';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'integer' })
  position: number;

  @Column()
  columnId: number;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => ColumnEntity, (column) => column.cards)
  column: ColumnEntity;

  @OneToMany(() => Comment, (comment) => comment.card)
  comments: Comment[];
}
