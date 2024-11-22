"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import { AUTH_REDIRECT_URL_PATH, FIGMA_URLS } from "src/common/constants";
import { appConfig } from "src/config";
import { validateFigmaUrlAndExtractFigmaFileKey } from "src/utils/figma";
import styles from "./page.module.css";

const InteralPoc = () => {
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement>(null);

	const getFigmaAuthUrl = (key: string) => {
		const currOrigin = window.location.origin;

		const baseUrl = new URL(FIGMA_URLS.authPath, FIGMA_URLS.baseUrl);
		const queryParams = new URLSearchParams({
			client_id: appConfig.figmaClientId,
			redirect_uri: new URL(
				AUTH_REDIRECT_URL_PATH,
				currOrigin
			).toString(),
			scope: "files:read",
			state: btoa(key),
			response_type: "code",
		});

		return `${baseUrl.toString()}?${queryParams.toString()}`;
	};

	const redirectToFigmaAuth = () => {
		try {
			if (!inputRef.current?.value) {
				throw new Error("no url provided");
			}
			const key = validateFigmaUrlAndExtractFigmaFileKey(
				inputRef.current?.value
			);

			router.push(getFigmaAuthUrl(key));
		} catch (e) {
			console.log("==== error redirecting", e);
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.input}>
				Figma project url here (eg.
				https://www.figma.com/sometype/somekey/somename
				&lt;https://www.figma.com/design/ab12cDEFghiJk/Untitled&gt;)
				<input ref={inputRef} type="text" />
			</div>
			<div>
				<button onClick={redirectToFigmaAuth}>generate now</button>
			</div>
		</div>
	);
};

export default InteralPoc;
