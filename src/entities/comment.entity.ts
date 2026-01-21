import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Card } from './card.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  text: string;

  @Column()
  cardId: number;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => Card, (card) => card.comments)
  card: Card;
}
