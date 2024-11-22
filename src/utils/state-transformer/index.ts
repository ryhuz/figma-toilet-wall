const STATE_PREFIX = "key=";

export const encodeState = (key: string) => btoa(STATE_PREFIX + btoa(key));

export const decodeState = (encoded: string) => {
	const decoded = atob(encoded);
	if (!decoded.includes(STATE_PREFIX)) {
		throw new Error("invalid state");
	}

	return atob(decoded.replace(STATE_PREFIX, ""));
};
