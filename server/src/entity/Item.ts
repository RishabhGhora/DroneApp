import { Entity, PrimaryColumn, Column, BaseEntity } from 'typeorm'

@Entity('ITEM')
export default class Item extends BaseEntity {
	@PrimaryColumn()
	ItemName: string

	@Column()
	ItemType: string

	@Column()
	Origin: string

	@Column()
	Organic: string
}
