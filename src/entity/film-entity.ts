import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Film {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    title!: string

    @Column()
    release_date!: Date

    @Column('simple-array')
    characters!: string[]

    @CreateDateColumn()
    created_at!: Date
}