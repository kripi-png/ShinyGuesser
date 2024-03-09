const padNumber = (number: number) => {
	return number.toString().padStart(2, '0');
};

export const formatSeconds = (secs: number) => {
	let minutes = padNumber(Math.floor(secs / 60));
	let seconds = padNumber(secs - Number(minutes) * 60);
	return `${minutes}:${seconds}`;
};
