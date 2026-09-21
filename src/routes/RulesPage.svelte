<script lang="ts">
	import { rules } from '$lib/data/rules';
	import { useReveal } from '$lib/useReveal';
</script>

<section class="rules">
	<div class="container">
		<header class="rules__head" use:useReveal>
			<p class="eyebrow">Community</p>
			<h1 class="rules__title">Team <span class="gradient-text">Rules &amp; Policies</span></h1>
			<p class="rules__intro">
				The way we show up — on stream, off stream, and in every community we touch — is what makes
				Eternal Wind a team. These nine rules keep the breeze comfortable for everyone.
			</p>
		</header>

		<ol class="rules__list">
			{#each rules as rule, i (i)}
				<li class="reveal" style="--reveal-delay: {Math.min(i, 4) * 80}ms" use:useReveal>
					<span class="rules__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
					<div class="rules__body">
						<h2 class="rules__title-item">{rule.title}</h2>
						<p class="rules__text">{rule.body}</p>
					</div>
				</li>
			{/each}
		</ol>
	</div>
</section>

<style>
	.rules {
		position: relative;
		padding: calc(var(--nav-h) + 70px) 0 90px;
		min-height: 100dvh;
	}

	.rules__head {
		max-width: 660px;
		margin-bottom: 58px;
	}

	.rules__title {
		font-family: var(--font-display);
		font-size: clamp(2.2rem, 5.5vw, 3.4rem);
		font-weight: 700;
		letter-spacing: -0.02em;
		margin: 12px 0 14px;
	}

	.rules__intro {
		color: var(--text-dim);
		font-weight: 300;
		font-size: 1.02rem;
	}

	.rules__list {
		list-style: none;
		display: grid;
		gap: 18px;
		max-width: 860px;
		counter-reset: rule;
	}

	.rules__list li {
		position: relative;
		display: flex;
		align-items: flex-start;
		gap: 22px;
		padding: 28px 30px;
		border-radius: var(--radius-lg);
		background: var(--surface);
		border: 1px solid var(--border);
		backdrop-filter: blur(14px);
		overflow: hidden;
		transition:
			border-color 0.3s ease,
			box-shadow 0.3s ease,
			transform 0.3s ease;
	}

	.rules__list li::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(100deg, rgba(139, 92, 246, 0.09), transparent 45%, rgba(34, 211, 238, 0.07));
		opacity: 0;
		transition: opacity 0.35s ease;
	}

	.rules__list li:hover {
		border-color: var(--border-strong);
		box-shadow: 0 24px 60px -26px rgba(139, 92, 246, 0.4);
		transform: translateY(-3px);
	}

	.rules__list li:hover::before {
		opacity: 1;
	}

	.rules__num {
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 700;
		line-height: 1.2;
		padding: 8px 14px;
		border-radius: 14px;
		background: linear-gradient(150deg, rgba(139, 92, 246, 0.22), rgba(34, 211, 238, 0.18));
		border: 1px solid var(--border);
		color: #c7d2fe;
		flex-shrink: 0;
	}

	.rules__body {
		flex: 1;
	}

	.rules__title-item {
		font-family: var(--font-display);
		font-size: 1.12rem;
		font-weight: 600;
		margin-bottom: 8px;
		letter-spacing: 0.01em;
	}

	.rules__text {
		color: var(--text-dim);
		font-weight: 300;
		font-size: 0.95rem;
	}

	@media (max-width: 560px) {
		.rules {
			padding: calc(var(--nav-h) + 44px) 0 60px;
		}
		.rules__list li {
			flex-direction: column;
			gap: 14px;
			padding: 24px 20px;
		}
	}
</style>