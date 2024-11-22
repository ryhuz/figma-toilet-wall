const getFileVersionHistoryUrl = (fileKey: string) =>
	`v1/files/${fileKey}/versions`;

export const FIGMA_URLS = {
	baseUrl: "https://www.figma.com",
	apiBaseUrl: "https://api.figma.com",
	authPath: "oauth",
	tokenPath: "v1/oauth/token",
	userInfoPath: "v1/me",
	fileVersionPath: getFileVersionHistoryUrl,
};

export const AUTH_REDIRECT_URL_PATH = "figma/callback";
