import { Entity, PrimaryColumn, BaseEntity, Column } from 'typeorm'

@Entity('CHAIN_ITEM')
export default class ChainItem extends BaseEntity {
	@PrimaryColumn()
	ChainItemName: string

	@PrimaryColumn()
	ChainName: string

	@PrimaryColumn()
	PLUNumber: number

	@Column()
	Orderlimit: number

	@Column()
	Quantity: number

	@Column()
	Price: number
}
