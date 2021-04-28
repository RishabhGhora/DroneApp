import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'

@Entity('DRONE')
export default class Drone extends BaseEntity {
	@PrimaryGeneratedColumn()
	ID: number

	@Column()
	DroneStatus: string

	@Column()
	Zip: number

	@Column()
	Radius: number

	@Column()
	DroneTech: string
}
