export const debug = function ConsoleDebug(isEnabled: Boolean) {
	if (!isEnabled) {
		console.log = () => {};
		console.group = console.groupEnd = () => {};
		console.warn = console.error = () => {};
	} else return;
};
