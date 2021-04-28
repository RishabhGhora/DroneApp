import { Entity, PrimaryColumn, BaseEntity } from 'typeorm'

@Entity('EMPLOYEE')
export default class Employee extends BaseEntity {
	@PrimaryColumn()
	Username: string
}
