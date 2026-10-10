<script lang="ts">
	import { onMount } from 'svelte';

	let visible = $state(false);

	const onScroll = () => {
		visible = window.scrollY > 600;
	};

	onMount(() => {
		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();
		return () => window.removeEventListener('scroll', onScroll);
	});

	const toTop = () => {
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
	};
</script>

<button
	class="to-top {visible ? 'is-visible' : ''}"
	tabindex={visible ? 0 : -1}
	aria-label="Back to top"
	onclick={toTop}
>
	<svg
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<path d="M12 19V5" />
		<path d="m5 12 7-7 7 7" />
	</svg>
</button>

<style>
	.to-top {
		position: fixed;
		right: 24px;
		bottom: 24px;
		z-index: 40;
		width: 46px;
		height: 46px;
		border-radius: 50%;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: var(--text-dim);
		background: rgba(5, 6, 15, 0.72);
		border: 1px solid var(--border);
		backdrop-filter: blur(14px);
		cursor: pointer;
		opacity: 0;
		transform: translateY(12px);
		pointer-events: none;
		transition:
			opacity 0.3s ease,
			transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
			color 0.25s ease,
			border-color 0.25s ease,
			box-shadow 0.25s ease;
	}

	.to-top.is-visible {
		opacity: 1;
		transform: none;
		pointer-events: auto;
	}

	.to-top:hover {
		color: #fff;
		border-color: color-mix(in srgb, var(--violet) 50%, var(--border));
		box-shadow: 0 10px 26px -12px rgba(139, 92, 246, 0.5);
		transform: translateY(-3px);
	}

	.to-top:focus-visible {
		outline: 2px solid var(--violet);
		outline-offset: 2px;
	}

	@media (max-width: 560px) {
		.to-top {
			right: 16px;
			bottom: 16px;
			width: 42px;
			height: 42px;
		}
	}
</style>