import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'

@Entity('ORDERS')
export default class Order extends BaseEntity {
	@PrimaryGeneratedColumn()
	ID: number

	@Column()
	OrderStatus: string

	@Column()
	OrderDate: string

	@Column()
	CustomerUsername: string

	@Column()
	DroneID: number
}
