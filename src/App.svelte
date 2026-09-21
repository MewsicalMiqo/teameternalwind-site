<script lang="ts">
	import { startRouter, route } from '$lib/router';
	import NavBar from './components/NavBar.svelte';
	import Footer from './components/Footer.svelte';
	import ParticleWind from './components/ParticleWind.svelte';
	import Home from './routes/Home.svelte';
	import RulesPage from './routes/RulesPage.svelte';

	const stop = startRouter();
	$: current = $route;

	// Jump back to the top of the page when the route actually changes
	let lastRoute: 'home' | 'rules' | null = null;
	$: {
		if (lastRoute !== null && lastRoute !== current) {
			window.scrollTo({ top: 0, behavior: 'auto' });
		}
		lastRoute = current;
	}
</script>

<div class="aurora" aria-hidden="true">
	<span></span>
	<span></span>
	<span></span>
</div>
<div class="grain" aria-hidden="true"></div>
<ParticleWind />

<NavBar />
<main>
	{#if current === 'rules'}
		{#key $route}
			<RulesPage />
		{/key}
	{:else}
		{#key $route}
			<Home />
		{/key}
	{/if}
</main>
<Footer />