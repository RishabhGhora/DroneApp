import { Entity, PrimaryColumn, Column, BaseEntity } from 'typeorm'

@Entity('STORE')
export default class Store extends BaseEntity {
	@PrimaryColumn()
	StoreName: string

	@PrimaryColumn()
	ChainName: string

	@PrimaryColumn()
	Zipcode: number

	@Column()
	Street: string

	@Column()
	City: string

	@Column()
	State: string
}
