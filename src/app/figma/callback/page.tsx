"use client";

import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import styles from "./callback.module.css";
import { FigmaCallbackFallback } from "./fallback";
import { TVersion } from "src/common/types";

const FigCallComponent = () => {
	const params = useSearchParams();

	const [fileHistory, setFileHistory] = useState<TVersion[]>();

	useEffect(() => {
		const getHistory = async () => {
			const { data } = await axios.get("/api/figma/getThing", {
				params: {
					code: params.get("code"),
					state: params.get("state"),
				},
			});

			setFileHistory(data);
		};

		getHistory();
	}, [params]);

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
