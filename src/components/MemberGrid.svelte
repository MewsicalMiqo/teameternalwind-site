<script lang="ts">
	import { members } from '$lib/data/members';
	import MemberTile from './MemberTile.svelte';
	import { useReveal } from '$lib/useReveal';
</script>

<section id="members" class="members" role="list" aria-label="Team members">
	<div class="container">
		<header class="section-head" use:useReveal>
			<p class="eyebrow">The Crew</p>
			<h2 class="section-title">Meet <span class="gradient-text">our members</span></h2>
			<p class="section-sub">Eight personalities, one endless wind. Hover over a tile to say hi.</p>
		</header>

		<div class="grid">
			{#each members as member, i (member.id)}
				<div class="reveal" style="--reveal-delay: {i * 70}ms" use:useReveal>
					<MemberTile member={member} />
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.members {
		padding: 110px 0 90px;
		position: relative;
	}

	.section-head {
		max-width: 640px;
		margin-bottom: 54px;
	}

	.section-title {
		font-family: var(--font-display);
		font-size: clamp(1.9rem, 4.4vw, 2.9rem);
		font-weight: 700;
		letter-spacing: -0.02em;
		margin: 12px 0 10px;
	}

	.section-sub {
		color: var(--text-dim);
		font-weight: 300;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 20px;
		perspective: 1200px;
	}

	@media (max-width: 1080px) {
		.grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 560px) {
		.members {
			padding: 80px 0 60px;
		}
		.grid {
			grid-template-columns: 1fr;
			gap: 16px;
		}
	}
</style>