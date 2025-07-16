import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number; // Primary key for each post

    @Column()
    userId: string; // Keycloak user sub as user ID

    @Column()
    title: string;

    @Column('text')
    content: string;
}

