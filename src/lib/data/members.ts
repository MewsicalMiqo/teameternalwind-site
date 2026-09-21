import mewsicalmiqo from '$assets/avatars/mewsicalmiqo.png';
import tayetales from '$assets/avatars/tayetales.png';
import fizzygames from '$assets/avatars/fizzygames.jpg';
import rinnibun from '$assets/avatars/rinnibun.jpg';
import dreamyetude from '$assets/avatars/dreamyetude.jpg';
import aurangaming from '$assets/avatars/aurangaming.png';
import onmyoujin from '$assets/avatars/onmyoujin.jpg';
import ahrieffect from '$assets/avatars/ahrieffect.png';

export type SocialKey = 'twitch' | 'x' | 'discord' | 'instagram' | 'youtube' | 'tiktok';

export interface SocialLink {
	key: SocialKey;
	url: string;
}

export interface Member {
	id: string;
	name: string;
	bio: string;
	avatar: string;
	accent: string;
	socials: SocialLink[];
}

export const members: Member[] = [
	{
		id: 'mewsicalmiqo',
		name: 'MewsicalMiqo',
		bio: 'Queen of the Cosmos, professional Hoyoverse creator and Unity streamer. I hope you will come hang out in my comfy booli-free zone.',
		avatar: mewsicalmiqo,
		accent: '#e879f9',
		socials: [
			{ key: 'twitch', url: 'https://www.twitch.tv/MewsicalMiqo' },
			{ key: 'x', url: 'https://twitter.com/mewsicalmiqo' },
			{ key: 'discord', url: 'https://discord.gg/mewmiverse' },
			{ key: 'youtube', url: 'https://www.youtube.com/mewsicalmiqo' },
		],
	},
	{
		id: 'tayetales',
		name: 'TayeTales',
		bio: "I'm a gamer girl who played WoW for over 10 years. I love games invested in strong story and character development, MMOs and strategy games. My main love is DnD, which I stream regularly. Currently the MMO I am playing is FFXIV.",
		avatar: tayetales,
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
		bio: 'Hello!~ I\'m Fizzy, a comfy lizzer VTuber and XIV raider. Come in and enjoy the chill vibes and discussion as we play XIV, Destiny 2, and the occasional variety game.',
		avatar: fizzygames,
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
		avatar: rinnibun,
		accent: '#60a5fa',
		socials: [
			{ key: 'twitch', url: 'https://twitch.tv/rinnibun' },
			{ key: 'x', url: 'https://twitter.com/rinnibun' },
			{ key: 'discord', url: 'https://discord.gg/wpqjEfWSpU' },
			{ key: 'instagram', url: 'https://instagram.com/rinnibun0' },
			{ key: 'tiktok', url: 'https://www.tiktok.com/@rinnibun' },
		],
	},
	{
		id: 'dreamyetude',
		name: 'DreamyEtude',
		bio: 'Welcome in everybody, my name is Dreamy and I’m a magical bunny girl vtuber! I am a FFXIV streamer but sometimes you can find me playing multiplayer games with friends 💖 #1 Kazooist on Twitch.',
		avatar: dreamyetude,
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
		bio: 'Hi cuties! ❤️🖤 Projekt Auran here — just call me Auran! I am a Blood Moon Bunny, sometimes elf. Playing games is what I do best: gacha games, MMOs, and being a VTuber mama of many (Vroid). Let’s have some fun!',
		avatar: aurangaming,
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
		bio: 'Jin for short — a demon “goat boy” (actually just a demon) that coalesced from lost souls at the edge of Purgatory. With Lust, Gluttony, and Sloth as his primary aspects, he mostly just wants to play sussy video games and eat cookies all day. Can be summoned with offerings of baked goods.',
		avatar: onmyoujin,
		accent: '#fb923c',
		socials: [
			{ key: 'twitch', url: 'https://twitch.tv/onmyoujin' },
			{ key: 'x', url: 'https://twitter.com/onmyoujin' },
			{ key: 'discord', url: 'https://discord.gg/ap224rxnvG' },
		],
	},
	{
		id: 'ahrieffect',
		name: 'ahrieffect',
		bio: 'FFXIV Hyur/catgirl VTuber! Hardcore Raider, Deep Dungeon Delver, and Community Builder! If you need help with any piece of content, look no further — my mission is for our stream to be the place where casual players get into endgame raiding. :)',
		avatar: ahrieffect,
		accent: '#2dd4bf',
		socials: [
			{ key: 'twitch', url: 'https://www.twitch.tv/ahrieffect' },
			{ key: 'x', url: 'https://twitter.com/ahri_ni' },
			{ key: 'discord', url: 'https://discord.gg/kugGpcFTE5' },
			{ key: 'youtube', url: 'https://www.youtube.com/channel/UCgpDScjAuHU8p89FrC96tKQ' },
		],
	},
];
