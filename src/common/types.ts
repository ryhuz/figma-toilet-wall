export type TTokenResponse = {
	user_id: string;
	access_token: string;
	expires_in: number;
	refresh_token: string;
};

export type TUserInfo = {
	id: string; // user ID
	email: string;
	handle: string; // display name
	img_url: string; // gravatar
};

type TVersion = {
	created_at: string;
	id: string; // version id
	label: string;
	description: string;
	thumbnail_url: string;
	user: TUserInfo;
};

export type TVersionHistoryResponse = {
	versions: TVersion[];
	pagination: {
		prev_page: string;
		next_page: string;
	};
};
