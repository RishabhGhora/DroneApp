import { Entity, PrimaryColumn, BaseEntity } from 'typeorm'

@Entity('CHAIN')
export default class Chain extends BaseEntity {
	@PrimaryColumn()
	ChainName: string
}
