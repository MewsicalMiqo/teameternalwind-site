<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		href = '',
		variant = 'ghost',
		strength = 0.35,
		children,
	} = $props<{
		href?: string;
		variant?: 'primary' | 'ghost';
		strength?: number;
		children?: Snippet;
	}>();

	let el = $state<HTMLElement | null>(null);
	let offset = $state({ x: 0, y: 0 });
	let active = $state(false);

	const external = $derived(href.startsWith('http'));

	function onMove(e: PointerEvent) {
		if (!el) return;
		const r = el.getBoundingClientRect();
		offset = {
			x: (e.clientX - (r.left + r.width / 2)) * strength,
			y: (e.clientY - (r.top + r.height / 2)) * strength,
		};
		active = true;
	}

	function reset() {
		offset = { x: 0, y: 0 };
		active = false;
	}
</script>

<a
	class="magnetic {variant} {active ? 'is-active' : ''}"
	{href}
	bind:this={el}
	target={external ? '_blank' : undefined}
	rel={external ? 'noopener noreferrer' : undefined}
	onpointermove={onMove}
	onpointerleave={reset}
>
	{@render children?.()}
</a>

<style>
	.magnetic {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 14px 26px;
		border-radius: 999px;
		font-family: var(--font-display);
		font-size: 0.95rem;
		font-weight: 600;
		letter-spacing: 0.01em;
		transition:
			transform 0.2s cubic-bezier(0.22, 1, 0.36, 1),
			box-shadow 0.3s ease,
			border-color 0.3s ease,
			background 0.3s ease;
		will-change: transform;
	}

	.primary {
		background: linear-gradient(100deg, #8b5cf6 0%, #6366f1 45%, #22d3ee 100%);
		color: #05060f;
		box-shadow: 0 10px 34px -8px rgba(139, 92, 246, 0.55);
	}

	.primary:hover,
	.primary.is-active {
		box-shadow: 0 14px 44px -8px rgba(34, 211, 238, 0.55);
	}

	.ghost {
		background: var(--surface);
		border: 1px solid var(--border);
		backdrop-filter: blur(12px);
		color: var(--text);
	}

	.ghost:hover,
	.ghost.is-active {
		border-color: var(--border-strong);
		background: var(--surface-strong);
	}
</style>