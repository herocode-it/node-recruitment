import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm'

import { Movies } from './movies'

@Entity('favourites')
export class Favourites {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    name: string

    @ManyToMany(() => Movies)
    @JoinTable()
    movies: Movies[]
}