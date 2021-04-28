import { Entity, PrimaryColumn, Column, BaseEntity } from 'typeorm'

@Entity('CUSTOMER')
export default class Customer extends BaseEntity {
	@PrimaryColumn()
	Username: string

	@Column()
	CcNumber: string

	@Column()
	CVV: number

	@Column()
	EXP_DATE: string
}
