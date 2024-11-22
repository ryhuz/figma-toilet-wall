import { FIGMA_URLS } from "src/common/constants";

export const validateFigmaUrlAndExtractFigmaFileKey = (_url: string) => {
	const url = new URL(_url);

	if (url.origin !== FIGMA_URLS.baseUrl) {
		throw new Error("not a figma url");
	}

	const [, type, key] = url.pathname.split("/");

	if (!type || !key) {
		throw new Error("url missing details");
	}

	return key;
};
