"use client";

import axios, { AxiosError } from "axios";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { TVersionKeyInfo } from "src/common/types";
import styles from "./callback.module.css";
import { FigmaCallbackFallback } from "./fallback";

const FigCallComponent = () => {
	const params = useSearchParams();

	const [fileHistory, setFileHistory] = useState<TVersionKeyInfo[]>();
	const [error, setError] = useState(false);

	useEffect(() => {
		const getHistory = async () => {
			try {
				const { data } = await axios.get<TVersionKeyInfo[]>(
					"/api/figma/getThing",
					{
						params: {
							code: params.get("code"),
							state: params.get("state"),
						},
					}
				);

				setFileHistory(data);
			} catch (e) {
				if (
					e instanceof AxiosError &&
					e.status === 404 &&
					e.response?.statusText === "File not found"
				) {
					setError(true);
				}
			}
		};

		getHistory();
	}, [params]);

	if (error) {
		return <div className={styles.container}>file not found</div>;
	}

	if (!fileHistory) {
		return <FigmaCallbackFallback />;
	}

	if (!fileHistory.length) {
		return <div className={styles.container}>you got nothing sorry</div>;
	}

	return (
		<div className={styles.container}>
			{fileHistory.map((history) => (
				<div key={history.id} style={{ marginBottom: 16 }}>
					<div>{history.label || "No label"}</div>
					<div>{history.description || "No description"}</div>
					<div>
						{/* figure out display with timezone */}
						{new Date(history.created_at).toDateString()}
					</div>
				</div>
			))}
		</div>
	);
};

const FigCall = () => (
	<Suspense fallback={<FigmaCallbackFallback />}>
		<FigCallComponent />
	</Suspense>
);

export default FigCall;
