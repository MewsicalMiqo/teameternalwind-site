<script lang="ts">
	import { navigate } from '$lib/router';
	import { team } from '$lib/data/team';
	import logo from '$assets/avatars/logo.gif';
	import MagneticButton from './MagneticButton.svelte';
	import SocialIcon from './SocialIcon.svelte';
</script>

<section class="hero" aria-label="Introduction">
	<div class="container hero__inner">
		<div class="hero__badge">
			<img class="hero__logo" src={logo} alt="Team Eternal Wind logo" />
		</div>
		<p class="eyebrow">VTuber Team</p>
		<h1 class="hero__title">Team <span class="gradient-text">Eternal Wind</span></h1>
		<p class="hero__mission">{team.mission}</p>
		<div class="hero__ctas">
			<MagneticButton variant="primary" href={team.twitch}>
				<SocialIcon icon="twitch" size={19} />
				Follow on Twitch
			</MagneticButton>
			<MagneticButton href={team.x}>
				<SocialIcon icon="x" size={17} />
				X&nbsp;/&nbsp;Twitter
			</MagneticButton>
			<MagneticButton href={team.youtube}>
				<SocialIcon icon="youtube" size={18} />
				YouTube
			</MagneticButton>
		</div>
		<button class="hero__scroll" onclick={() => navigate('home', 'members')} aria-label="Scroll down to meet the crew">
			<span>Meet the crew</span>
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="M12 5v14M19 12l-7 7-7-7" />
			</svg>
		</button>
	</div>
</section>

<style>
	.hero {
		position: relative;
		min-height: 100dvh;
		display: flex;
		align-items: center;
		padding-top: calc(var(--nav-h) + 24px);
		padding-bottom: 64px;
	}

	.hero__inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.hero__badge {
		margin-bottom: 22px;
	}

	.hero__logo {
		width: 118px;
		height: 118px;
		border-radius: 28px;
		object-fit: cover;
		border: 1px solid var(--border-strong);
		box-shadow:
			0 0 0 6px rgba(139, 92, 246, 0.12),
			0 24px 70px -20px rgba(139, 92, 246, 0.55);
		animation: float 5.5s ease-in-out infinite;
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	.hero__title {
		font-family: var(--font-display);
		font-size: clamp(2.7rem, 7.5vw, 4.8rem);
		font-weight: 700;
		line-height: 1.05;
		letter-spacing: -0.02em;
		margin: 10px 0 18px;
	}

	.hero__mission {
		max-width: 620px;
		color: var(--text-dim);
		font-size: clamp(1rem, 1.6vw, 1.13rem);
		font-weight: 300;
	}

	.hero__ctas {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 14px;
		margin-top: 34px;
	}

	.hero__scroll {
		margin-top: 64px;
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		color: var(--text-dim);
		font-family: var(--font-display);
		font-size: 0.85rem;
		letter-spacing: 0.06em;
		transition: color 0.25s ease;
	}

	.hero__scroll svg {
		animation: bob 1.8s ease-in-out infinite;
	}

	@keyframes bob {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(6px);
		}
	}

	.hero__scroll:hover {
		color: var(--text);
	}
</style>