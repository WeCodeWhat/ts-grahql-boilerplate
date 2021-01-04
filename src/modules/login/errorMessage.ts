export enum ErrorMessages {
	defaultMessage = "Wrong credentials",
	emailIsNotConfirmed = "Please verify your email before logins",
	forgotPasswordLock = "Account is locked",
}

export type ErrorType = {
	path: String;
	message: String;
};
