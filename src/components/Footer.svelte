<script lang="ts">
	import { team } from '$lib/data/team';
	import { members } from '$lib/data/members';
	import SocialIcon from './SocialIcon.svelte';
</script>

<footer class="footer">
	<div class="container footer__inner">
		<div class="footer__brand">
			<p class="footer__name">Team <span class="gradient-text">Eternal Wind</span></p>
			<p class="footer__tag">Wherever the wind blows, you're welcome here.</p>
		</div>

		<nav class="footer__links" aria-label="Team links">
			<a href={team.twitch} target="_blank" rel="noopener noreferrer">
				<SocialIcon icon="twitch" size={18} /> <span>Team on Twitch</span>
			</a>
		</nav>

		<p class="footer__note">
			{members.length} VTubers riding the same breeze · © {new Date().getFullYear()} Team Eternal Wind
		</p>
	</div>
</footer>

<style>
	.footer {
		position: relative;
		z-index: 2;
		border-top: 1px solid var(--border);
		background: rgba(5, 6, 15, 0.6);
		backdrop-filter: blur(10px);
		padding: 44px 0 34px;
		margin-top: 40px;
	}

	.footer__inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 18px;
		text-align: center;
	}

	.footer__name {
		font-family: var(--font-display);
		font-size: 1.15rem;
		font-weight: 600;
	}

	.footer__tag {
		color: var(--text-dim);
		font-size: 0.9rem;
		font-weight: 300;
	}

	.footer__links {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px;
	}

	.footer__links a {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 9px 16px;
		border-radius: 999px;
		border: 1px solid var(--border);
		background: var(--surface);
		color: var(--text-dim);
		font-size: 0.88rem;
		transition:
			color 0.25s ease,
			border-color 0.25s ease,
			transform 0.25s ease;
	}

	.footer__links a:hover {
		color: #fff;
		border-color: var(--border-strong);
		transform: translateY(-2px);
	}

	.footer__note {
		color: var(--text-dim);
		font-size: 0.8rem;
		opacity: 0.7;
	}
</style>