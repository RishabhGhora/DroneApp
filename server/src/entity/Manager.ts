import { Entity, PrimaryColumn, Column, BaseEntity } from 'typeorm'

@Entity('MANAGER')
export default class Manager extends BaseEntity {
	@PrimaryColumn()
	Username: string

	@Column()
	ChainName: string
}
