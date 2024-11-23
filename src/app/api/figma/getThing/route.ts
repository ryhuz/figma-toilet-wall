import axios, { AxiosError } from "axios";
import { NextRequest } from "next/server";
import { AUTH_REDIRECT_URL_PATH, FIGMA_URLS } from "src/common/constants";
import {
	TTokenResponse,
	TUserInfo,
	TVersion,
	TVersionHistoryResponse,
} from "src/common/types";
import { appConfig } from "src/config";
import { decodeState } from "src/utils/state-transformer";

export async function GET(request: NextRequest) {
	const query = request.nextUrl.searchParams;

	const authCode = query.get("code");
	const encodedState = query.get("state");

	if (!authCode || !encodedState) {
		return new Response(undefined, {
			status: 400,
			statusText: "Bad Request",
		});
	}

	try {
		const fileKey = decodeState(encodedState);

		const { access_token } = await getFigmaToken(
			authCode,
			new URL(request.url).origin
		);

		const [userId, history] = await Promise.all([
			getFigmaUserId(access_token),
			getFigmaFileHistory(fileKey, access_token),
		]);

		const historyByUser = history.filter((item) => item.user.id === userId);
		console.log("==== getFigmaFileHistory response", historyByUser);

		return Response.json(historyByUser);
	} catch (e) {
		console.log("==== error in getThing", e);
		if (e instanceof AxiosError && e.status === 404) {
			return new Response(undefined, {
				status: 404,
				statusText: "File not found",
			});
		}
		return new Response(undefined, {
			status: 500,
			statusText: "Internal Server Error",
		});
	}
}

const getFigmaToken = async (authCode: string, basePath: string) => {
	console.log("==== getFigmaToken start");

	const tokenUrl = new URL(
		FIGMA_URLS.tokenPath,
		FIGMA_URLS.apiBaseUrl
	).toString();

	const authHeader = btoa(
		appConfig.figmaClientId + ":" + appConfig.figmaClientSecret
	);

	const { data } = await axios.post<TTokenResponse>(
		tokenUrl,
		{
			redirect_uri: new URL(AUTH_REDIRECT_URL_PATH, basePath).toString(),
			code: authCode,
			grant_type: "authorization_code",
		},
		{
			headers: {
				Authorization: `Basic ${authHeader}`,
				"Content-Type": "application/x-www-form-urlencoded",
			},
		}
	);

	console.log("==== getFigmaToken response", data);

	return data;
};

const getFigmaUserId = async (token: string) => {
	console.log("==== getFigmaUserId start");

	const getUserInfoUrl = new URL(
		FIGMA_URLS.userInfoPath,
		FIGMA_URLS.apiBaseUrl
	).toString();

	const { data } = await axios.get<TUserInfo>(getUserInfoUrl, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	console.log("==== getFigmaUserId response", data);
	return data.id;
};

const TEMP_NEXT_PAGE_LIMIT = 10;
const getFigmaFileHistory = async (
	fileKey: string,
	token: string,
	nextPageUrl?: string,
	currPage = 1
): Promise<TVersion[]> => {
	console.log("==== getFigmaFileHistory start. page", currPage);

	const getFileVersionHistoryUrl =
		nextPageUrl ||
		new URL(
			FIGMA_URLS.fileVersionPath(fileKey),
			FIGMA_URLS.apiBaseUrl
		).toString();

	const { data } = await axios.get<TVersionHistoryResponse>(
		getFileVersionHistoryUrl,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);

	if (data.pagination.next_page && currPage <= TEMP_NEXT_PAGE_LIMIT) {
		return [
			...data.versions,
			...(await getFigmaFileHistory(
				fileKey,
				token,
				data.pagination.next_page,
				currPage + 1
			)),
		];
	}
	return data.versions;
};
