// ⚠️ GENERATED FILE — do not edit by hand.
// Source: Google Sheet (see .github/workflows/update-members.yml, run manually).
// Regenerate: run the "Update Members from Sheet" workflow.

export type SocialKey = 'twitch' | 'x' | 'discord' | 'youtube' | 'tiktok' | 'instagram' | 'bluesky';

export interface SocialLink {
	key: SocialKey;
	url: string;
}

export interface Member {
	id: string;
	name: string;
	bio: string;
	avatar?: string;
	accent: string;
	socials: SocialLink[];
}

export const members: Member[] = [
	{
		id: 'mewsicalmiqo',
		name: 'MewsicalMiqo',
		bio: 'Queen of the Cosmos, professional Hoyoverse creator and Unity streamer. I hope you will come hang out in my comfy booli-free zone.',
		avatar: 'pfp/mewmi.png',
		accent: '#e879f9',
		socials: [
			{ key: 'twitch', url: 'https://www.twitch.tv/mewsicalmiqo' },
			{ key: 'x', url: 'https://x.com/MewsicalMiqo' },
			{ key: 'discord', url: 'https://discord.gg/mewmiverse' },
			{ key: 'youtube', url: 'https://www.youtube.com/@MewsicalMiqo' },
			{ key: 'bluesky', url: 'https://bsky.app/profile/mewsicalmiqo.bsky.social' },
		],
	},
	{
		id: 'tayetales',
		name: 'TayeTales',
		bio: 'I\'m a gamer girl who played WoW for over 10 years. I love games heavily invested in strong story and character development, MMO\'s and strategy games. My main love is DnD, which I stream regularly. Currently the MMO I am playing is FFXIV.',
		avatar: 'pfp/tayetales.png',
		accent: '#fbbf24',
		socials: [
			{ key: 'twitch', url: 'https://www.twitch.tv/TayeTales' },
			{ key: 'x', url: 'https://twitter.com/TayeTales' },
			{ key: 'instagram', url: 'https://www.instagram.com/mhientaye/' },
		],
	},
	{
		id: 'fizzygames',
		name: 'FizzyGames',
		bio: 'Hello!~ I\'m Fizzy, a comfy lizzer VTuber and XIV raider. Come in and enjoy the chill vibes and discussion as we play XIV, Destiny 2, and the occasional variety game',
		avatar: 'pfp/fizzy.jpg',
		accent: '#4ade80',
		socials: [
			{ key: 'twitch', url: 'https://www.twitch.tv/fizzygames' },
			{ key: 'x', url: 'https://twitter.com/FizzyGames_' },
			{ key: 'discord', url: 'https://discord.gg/fizzygames' },
			{ key: 'youtube', url: 'https://www.youtube.com/@fizzyvt' },
			{ key: 'tiktok', url: 'https://www.tiktok.com/@fizzyvt' },
		],
	},
	{
		id: 'rinnibun',
		name: 'RinniBun',
		bio: 'Bunny created by an Ancient Powerful Deity with Moon crystals to guard against chaotic creations~ 🐰 A Healer, I will protect and revive you~',
		avatar: 'pfp/rinnibun.jpg',
		accent: '#60a5fa',
		socials: [
			{ key: 'twitch', url: 'https://twitch.tv/rinnibun' },
			{ key: 'x', url: 'https://twitter.com/rinnibun' },
			{ key: 'discord', url: 'https://discord.gg/wpqjEfWSpU' },
			{ key: 'tiktok', url: 'https://www.tiktok.com/@rinnibun' },
			{ key: 'instagram', url: 'https://instagram.com/rinnibun0' },
		],
	},
	{
		id: 'dreamyetude',
		name: 'DreamyEtude',
		bio: 'Welcome in everybody, my name is Dreamy and I’m a magical bunny girl vtuber! I am a FFXIV streamer but sometimes you can find me playing multiplayer games with friends 💖 #1 Kazooist on Twitch.',
		avatar: 'pfp/dreamyetude.jpg',
		accent: '#f472b6',
		socials: [
			{ key: 'twitch', url: 'https://www.twitch.tv/dreamyetude' },
			{ key: 'x', url: 'https://twitter.com/DreamyEtude' },
			{ key: 'discord', url: 'https://discord.gg/hx7cy9f' },
			{ key: 'youtube', url: 'https://www.youtube.com/channel/UCT8yARsqGcAi8YltXaey9pQ' },
			{ key: 'tiktok', url: 'https://www.tiktok.com/@dreamyetude' },
		],
	},
	{
		id: 'projekt-auran',
		name: 'Projekt Auran',
		bio: 'Hi cuties! ❤️ 🖤 Projekt Auran here! Just call me Auran! I am a Blood Moon Bunny! Sometimes elf!\nPlaying games is what I do best!\nI often play gacha games and MMOs! I also am a Vtuber mama of many! (Vroid) Let\'s have some fun! Big!',
		avatar: 'pfp/projektauran.png',
		accent: '#fb7185',
		socials: [
			{ key: 'twitch', url: 'https://www.twitch.tv/aurangaming' },
			{ key: 'x', url: 'https://twitter.com/AuranGaming' },
			{ key: 'discord', url: 'https://discord.gg/Tcd2xr3qDw' },
			{ key: 'youtube', url: 'https://www.youtube.com/channel/UCX4hrTal_tn0TbDS6I4hTZw' },
			{ key: 'tiktok', url: 'https://www.tiktok.com/@aurangaming21' },
		],
	},
	{
		id: 'onmyoujin',
		name: 'Onmyoujin',
		bio: 'Onmyoujin, Jin for short, a demon "goat boy" (actually just a demon) that coalesced from lost souls at the edge of Purgatory. With Lust, Gluttony, and Sloth as his primary aspects, he mostly just wants to play sussy video games and eat cookies all day. Can be summoned with offerings of baked goods and hentai.',
		avatar: 'pfp/onmyoujin.jpg',
		accent: '#fb923c',
		socials: [
			{ key: 'twitch', url: 'https://twitch.tv/onmyoujin' },
			{ key: 'x', url: 'https://twitter.com/onmyoujin' },
			{ key: 'discord', url: 'https://discord.gg/ap224rxnvG' },
		],
	},
];
