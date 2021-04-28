import { Entity, PrimaryColumn, BaseEntity } from 'typeorm'

@Entity('ADMIN')
export default class Admin extends BaseEntity {
	@PrimaryColumn()
	Username: string
}
