import { Entity, PrimaryColumn, BaseEntity, Column } from 'typeorm'

@Entity('CONTAINS')
export default class Contains extends BaseEntity {
	@PrimaryColumn()
	OrderID: number

	@PrimaryColumn()
	ItemName: string

	@PrimaryColumn()
	ChainName: string

	@PrimaryColumn()
	PLUNumber: number

	@Column()
	Quantity: number
}
