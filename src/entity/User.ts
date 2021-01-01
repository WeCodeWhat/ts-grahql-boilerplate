import {
	Entity,
	Column,
	PrimaryColumn,
	BeforeInsert,
	BaseEntity,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcryptjs";

@Entity("users")
export class User extends BaseEntity {
	@PrimaryColumn("uuid", { nullable: false }) id: string;

	@Column("varchar", { length: 255, nullable: true, unique: true })
	email: string;

	@Column("text", { nullable: true }) password: string;

	@BeforeInsert()
	addId() {
		this.id = uuidv4();
	}

	@Column("boolean", { default: true })
	confirmed: boolean;

	@BeforeInsert()
	async hashPassword() {
		this.password = await bcrypt.hash(this.password, 10);
	}
}
