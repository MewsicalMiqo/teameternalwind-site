<script lang="ts">
	import type { Member } from '$lib/data/members';
	import SocialIcon from './SocialIcon.svelte';

	let { member } = $props<{ member: Member }>();

	const MAX_TILT = 7;

	let card = $state<HTMLElement | null>(null);
	let tilt = $state({ rx: 0, ry: 0, mx: 50, my: 50 });
	let hover = $state(false);

	function onMove(e: PointerEvent) {
		if (!card) return;
		if (e.pointerType !== 'mouse') return; // touch: skip tilt so scrolling stays cheap
		const r = card.getBoundingClientRect();
		const px = (e.clientX - r.left) / r.width;
		const py = (e.clientY - r.top) / r.height;
		tilt = {
			rx: (0.5 - py) * MAX_TILT,
			ry: (px - 0.5) * MAX_TILT,
			mx: px * 100,
			my: py * 100,
		};
		hover = true;
	}

	function onLeave() {
		tilt = { rx: 0, ry: 0, mx: 50, my: 50 };
		hover = false;
	}

	const socialLabels: Record<string, string> = {
		twitch: 'Twitch',
		x: 'X (Twitter)',
		discord: 'Discord',
		instagram: 'Instagram',
		youtube: 'YouTube',
		tiktok: 'TikTok',
		bluesky: 'Bluesky',
	};
</script>

<article
	class="tile {hover ? 'is-hover' : ''}"
	style="--accent: {member.accent}; --mx: {tilt.mx}%; --my: {tilt.my}%;"
	bind:this={card}
	onpointermove={onMove}
	onpointerleave={onLeave}
>
	<div class="tile__spot" aria-hidden="true"></div>

	{#if member.avatar}
		<div class="tile__avatar">
			<img
				src={member.avatar}
				alt={member.name}
				width="112"
				height="112"
				loading="lazy"
				decoding="async"
				draggable="false"
			/>
		</div>
	{/if}

	<h3 class="tile__name">{member.name}</h3>
	<p class="tile__bio">{member.bio}</p>

	{#if member.socials.length > 0}
		<ul class="tile__socials" aria-label={`${member.name} social links`}>
			{#each member.socials as social (social.key)}
				<li>
					<a
						href={social.url}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`${member.name} on ${socialLabels[social.key]}`}
					>
						<SocialIcon icon={social.key} size={18} />
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</article>

<style>
	.tile {
		position: relative;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 38px 26px 30px;
		border-radius: var(--radius-lg);
		/* Solid-ish surface instead of backdrop-filter: blurring the animated
		   canvas + aurora behind all 36 tiles on every frame was the main
		   scroll-jank source. The tinted semi-transparent panel keeps the glassy
		   look (aurora glow still bleeds through) at a fraction of the cost. */
		background: linear-gradient(160deg, rgba(23, 27, 52, 0.68), rgba(10, 13, 31, 0.6));
		border: 1px solid var(--border);
		overflow: hidden;
		transition:
			transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
			border-color 0.35s ease,
			box-shadow 0.35s ease;
	}

	.tile__spot {
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.35s ease;
		background:
			radial-gradient(340px circle at var(--mx) var(--my), color-mix(in srgb, var(--accent) 16%, transparent), transparent 68%),
			radial-gradient(600px circle at 50% 120%, color-mix(in srgb, var(--accent) 9%, transparent), transparent 70%);
	}

	.tile.is-hover {
		z-index: 2;
		transform: translateY(-6px) scale(1.03);
		border-color: color-mix(in srgb, var(--accent) 50%, var(--border));
		box-shadow:
			0 30px 70px -24px color-mix(in srgb, var(--accent) 42%, transparent),
			0 0 40px -12px color-mix(in srgb, var(--accent) 28%, transparent);
	}

	.tile.is-hover .tile__spot {
		opacity: 1;
	}

	.tile__avatar {
		position: relative;
		width: 112px;
		height: 112px;
		margin-bottom: 18px;
		transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.tile.is-hover .tile__avatar {
		transform: translateY(-5px) scale(1.06);
	}

	.tile__avatar::after {
		content: '';
		position: absolute;
		inset: -7px;
		border-radius: 50%;
		border: 1px dashed color-mix(in srgb, var(--accent) 45%, transparent);
		opacity: 0;
		transition: opacity 0.35s ease, transform 0.6s ease;
		transform: scale(0.9) rotate(0deg);
	}

	.tile.is-hover .tile__avatar::after {
		opacity: 1;
		transform: scale(1) rotate(18deg);
	}

	.tile__avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 50%;
		border: 2px solid color-mix(in srgb, var(--accent) 60%, transparent);
		box-shadow: 0 0 0 5px color-mix(in srgb, var(--accent) 12%, transparent);
		transition:
			box-shadow 0.35s ease,
			border-color 0.35s ease;
	}

	.tile.is-hover .tile__avatar img {
		border-color: var(--accent);
		box-shadow:
			0 0 0 5px color-mix(in srgb, var(--accent) 18%, transparent),
			0 18px 44px -12px color-mix(in srgb, var(--accent) 55%, transparent);
	}

	.tile__name {
		font-family: var(--font-display);
		font-size: 1.28rem;
		font-weight: 600;
		letter-spacing: 0.01em;
		margin-bottom: 10px;
		transition: color 0.3s ease, text-shadow 0.3s ease;
	}

	.tile.is-hover .tile__name {
		color: color-mix(in srgb, var(--accent) 80%, #fff);
		text-shadow: 0 0 24px color-mix(in srgb, var(--accent) 60%, transparent);
	}

	.tile__bio {
		font-size: 0.9rem;
		font-weight: 300;
		line-height: 1.65;
		color: var(--text-dim);
		flex-grow: 1;
	}

	.tile__socials {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
		margin-top: 20px;
	}

	.tile__socials li {
		opacity: 0;
		transform: translateY(10px);
		transition:
			opacity 0.3s ease,
			transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.tile__socials li:nth-child(1) {
		transition-delay: 0.03s;
	}
	.tile__socials li:nth-child(2) {
		transition-delay: 0.07s;
	}
	.tile__socials li:nth-child(3) {
		transition-delay: 0.11s;
	}
	.tile__socials li:nth-child(4) {
		transition-delay: 0.15s;
	}
	.tile__socials li:nth-child(5) {
		transition-delay: 0.19s;
	}

	.tile.is-hover .tile__socials li {
		opacity: 1;
		transform: none;
	}

	.tile__socials a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 38px;
		height: 38px;
		border-radius: 12px;
		color: var(--text-dim);
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid var(--border);
		transition:
			color 0.25s ease,
			border-color 0.25s ease,
			background 0.25s ease,
			transform 0.25s ease;
	}

	.tile__socials a:hover {
		color: #fff;
		border-color: color-mix(in srgb, var(--accent) 55%, var(--border));
		background: color-mix(in srgb, var(--accent) 16%, transparent);
		transform: translateY(-3px);
	}

	/* Touch devices: no hover — always show socials, skip tilt */
	@media (hover: none) {
		.tile__socials li {
			opacity: 1;
			transform: none;
		}
	}
</style>