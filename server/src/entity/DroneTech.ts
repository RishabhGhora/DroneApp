import { Entity, PrimaryColumn, Column, BaseEntity } from 'typeorm'

@Entity('DRONE_TECH')
export default class DroneTech extends BaseEntity {
	@PrimaryColumn()
	Username: string

	@Column()
	StoreName: string

	@Column()
	ChainName: string
}
