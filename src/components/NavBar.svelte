<script lang="ts">
	import { onMount } from 'svelte';
	import { navigate } from '$lib/router';
	import { team } from '$lib/data/team';
	import logo from '$assets/avatars/logo.gif';
	import SocialIcon from './SocialIcon.svelte';

	let current = $state<'home' | 'rules'>('home');
	let scrolled = $state(false);

	const onHashChange = () => {
		current = window.location.hash.replace(/^#\/?/, '').startsWith('rules') ? 'rules' : 'home';
	};
	const onScroll = () => {
		scrolled = window.scrollY > 14;
	};

	onMount(() => {
		window.addEventListener('hashchange', onHashChange);
		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();
		return () => {
			window.removeEventListener('hashchange', onHashChange);
			window.removeEventListener('scroll', onScroll);
		};
	});
</script>

<header class="nav {scrolled ? 'is-scrolled' : ''}">
	<div class="container nav__inner">
		<a href="#/" class="brand" aria-label="Team Eternal Wind home">
			<img class="brand__logo" src={logo} alt="" />
			<span class="brand__name">Team <span class="gradient-text">Eternal&nbsp;Wind</span></span>
		</a>

		<nav class="nav__links" aria-label="Primary">
			<button
				class="nav__link {current === 'home' ? 'is-active' : ''}"
				onclick={() => navigate('home', 'members')}
			>
				Members
			</button>
			<a href="#/rules" class="nav__link {current === 'rules' ? 'is-active' : ''}">Rules</a>
		</nav>

		<div class="nav__socials" aria-label="Team social links">
			<a href={team.twitch} target="_blank" rel="noopener noreferrer" aria-label="Twitch team channel">
				<SocialIcon icon="twitch" size={18} />
			</a>
		</div>
	</div>
</header>

<style>
	.nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 50;
		height: var(--nav-h);
		display: flex;
		align-items: center;
		transition:
			background 0.3s ease,
			border-color 0.3s ease,
			backdrop-filter 0.3s ease;
		border-bottom: 1px solid transparent;
	}

	.nav.is-scrolled {
		background: rgba(5, 6, 15, 0.72);
		backdrop-filter: blur(14px);
		border-bottom-color: var(--border);
	}

	.nav__inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		min-width: 0;
	}

	.brand__logo {
		width: 34px;
		height: 34px;
		border-radius: 10px;
		object-fit: cover;
		border: 1px solid var(--border);
	}

	.brand__name {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 0.98rem;
		white-space: nowrap;
	}

	.nav__links {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.nav__link {
		padding: 8px 16px;
		border-radius: 999px;
		font-family: var(--font-display);
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--text-dim);
		transition:
			color 0.25s ease,
			background 0.25s ease;
	}

	.nav__link:hover {
		color: var(--text);
		background: var(--surface);
	}

	.nav__link.is-active {
		color: #fff;
		background: var(--surface-strong);
	}

	.nav__socials {
		display: flex;
		align-items: center;
		gap: 2px;
	}

	.nav__socials a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 34px;
		height: 34px;
		border-radius: 50%;
		color: var(--text-dim);
		transition:
			color 0.25s ease,
			background 0.25s ease,
			transform 0.25s ease;
	}

	.nav__socials a:hover {
		color: #fff;
		background: var(--surface-strong);
		transform: translateY(-2px);
	}

	@media (max-width: 560px) {
		.brand__name {
			display: none;
		}
		.nav__link {
			padding: 8px 12px;
			font-size: 0.85rem;
		}
	}
</style>