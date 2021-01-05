import * as Yup from "yup";

export const yupSchemaValidation = {
	email: Yup.string().min(3).max(255).email(),
	password: Yup.string().min(3).max(255),
};
