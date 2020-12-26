import {
	Entity,
	Column,
	PrimaryColumn,
	BeforeInsert,
	BaseEntity,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity()
export class User extends BaseEntity {
	@PrimaryColumn("uuid", { nullable: false }) id: string;

	@Column("varchar", { length: 255, nullable: true })
	email: string;

	@Column("text", { nullable: true }) password: string;

	@BeforeInsert()
	addId() {
		this.id = uuidv4();
	}
}
