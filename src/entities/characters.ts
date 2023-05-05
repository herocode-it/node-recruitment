import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('characters')
export class Characters {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ unique: true })
    character_id: number
}