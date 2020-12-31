export enum ErrorMessages {
	defaultMessage = "Wrong credentials",
	emailIsNotConfirmed = "Please verify your email before logins",
}

export type ErrorType = {
	path: String;
	message: String;
};
