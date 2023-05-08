import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm'

import { Characters } from './characters'

@Entity('movies')
export class Movies {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column('date')
    release_date: Date

    @ManyToMany(() => Characters)
    @JoinTable()
    characters: Characters[]
}