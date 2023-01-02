import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'users' })
export class PgUser {
  @PrimaryGeneratedColumn('uuid')
    id!: string

  @Column({ nullable: false })
    name!: string

  @Column({ nullable: false, unique: true })
    email!: string

  @Column({ nullable: true })
    password!: string

  @Column({ nullable: false })
    image!: string

  @Column({ default: false, nullable: false })
    active!: boolean

  @Column({ name: 'activation_code', nullable: false })
    activationCode!: string

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: string

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAte!: string
}
