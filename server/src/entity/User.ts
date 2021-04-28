import { Entity, PrimaryColumn, Column, BaseEntity } from 'typeorm'

@Entity('USERS')
export default class User extends BaseEntity {
	@PrimaryColumn()
	Username: string

	@Column()
	Pass: string

	@Column()
	FirstName: string

	@Column()
	LastName: string

	@Column()
	Street: string

	@Column()
	City: string

	@Column()
	State: string

	@Column()
	Zipcode: number
}
