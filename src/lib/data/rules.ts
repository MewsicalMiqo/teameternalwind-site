export interface Rule {
	title: string;
	body: string;
}

export const rules: Rule[] = [
	{
		title: 'Maintain Consistent Stream Activity',
		body: 'Members are expected to stream regularly. We understand life happens and burnout is real, so taking breaks or hiatuses is completely fine — just be sure to notify team leadership or give a heads-up in the team Discord beforehand.',
	},
	{
		title: 'Support Teammates On and Off Stream',
		body: 'While no one has unlimited time, we encourage genuine engagement across the team. Small gestures — like dropping a lurk/tab, popping into chat, raiding/hosting teammates, or interacting in each other’s Discord servers — help us grow as a connected community rather than just a roster of names.',
	},
	{
		title: 'Uphold Personal and Team Integrity',
		body: 'Be mindful of your conduct on stream, on social media, and in community spaces. Avoid behavior, harassment, hate speech, or public drama that harms your reputation or reflects poorly on the team and its members.',
	},
	{
		title: 'Moderate and Guide Your Community',
		body: 'Streamers are responsible for setting the tone of their communities. While natural viewer interactions are encouraged, if members of your audience harass or create negative experiences for fellow teammates, you are expected to address the issue and enforce moderation appropriately.',
	},
	{
		title: 'Follow Platform Terms of Service (ToS)',
		body: "Members must adhere strictly to Twitch's Terms of Service and Community Guidelines. Any action resulting in a severe or permanent ban will lead to automatic removal from the team.",
	},
	{
		title: 'Prioritize Internal Conflict Resolution',
		body: 'Disagreements and interpersonal issues between teammates must be handled privately via direct messages or brought to team leadership using the ticket bot in the team Discord. Do not air grievances publicly on stream, in public channels, or on social media.',
	},
	{
		title: 'Represent the Brand Professionally (Panels & Badges)',
		body: 'Members should display the team badge on Twitch and consider including a team panel or info link in their stream descriptions or Discord servers to help cross-promote the community.',
	},
	{
		title: 'Participate in Team Events & Communications',
		body: 'Stay reasonably active in our team announcements channel to remain informed of updates. While attendance at team events, charity streams, or community game nights is not always mandatory, participation and collaboration are strongly encouraged.',
	},
	{
		title: 'Inactivity & Removal Policy',
		body: 'Unannounced prolonged inactivity (e.g., 90+ days without streaming or communication) or repeated rule violations may result in a check-in from leadership and potential removal from the team to keep the roster active.',
	},
];
