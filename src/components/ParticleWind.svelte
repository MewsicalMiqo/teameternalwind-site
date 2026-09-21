<script lang="ts">
	import { onMount } from 'svelte';

	const COUNT = 110;
	const MAX_LINE = 150;

	let canvas = $state<HTMLCanvasElement | null>(null);
	let ctx: CanvasRenderingContext2D | null = null;
	let width = 0;
	let height = 0;
	let raf = 0;
	let t = 0;

	const reduced =
		typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

	interface Streak {
		x: number;
		y: number;
		len: number;
		speed: number;
		amp: number;
		freq: number;
		phase: number;
		hue: number;
		alpha: number;
	}

	let streaks: Streak[] = [];
	const mouse = { y: 0.5, active: false };

	const random = (min: number, max: number) => min + Math.random() * (max - min);

	function spawn(entered = false): Streak {
		return {
			x: entered ? -random(40, MAX_LINE) : random(-MAX_LINE, width),
			y: random(0, height),
			len: random(40, MAX_LINE),
			speed: random(0.35, 1.7),
			amp: random(6, 28),
			freq: random(0.008, 0.03),
			phase: random(0, Math.PI * 2),
			hue: random(190, 268), // cyan ↔ violet
			alpha: random(0.04, 0.15),
		};
	}

	function resize() {
		if (!canvas) return;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		width = window.innerWidth;
		height = window.innerHeight;
		canvas.width = Math.floor(width * dpr);
		canvas.height = Math.floor(height * dpr);
		ctx = canvas.getContext('2d');
		if (ctx) {
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.lineCap = 'round';
		}
		streaks = Array.from({ length: COUNT }, () => spawn());
		drawFrame(1.2);
	}

	function drawFrame(speed: number) {
		if (!ctx) return;
		ctx.clearRect(0, 0, width, height);
		for (const s of streaks) {
			const sway = Math.sin(t * s.freq + s.phase) * s.amp;
			const y = s.y + sway + (mouse.active ? (mouse.y - 0.5) * 16 : 0);
			const slope = Math.cos(t * s.freq + s.phase) * s.amp * 0.35;
			ctx.strokeStyle = `hsla(${s.hue}, 95%, 74%, ${s.alpha})`;
			ctx.lineWidth = 1.1;
			ctx.beginPath();
			ctx.moveTo(s.x, y);
			ctx.quadraticCurveTo(s.x - s.len * 0.5, y - slope, s.x - s.len, y - slope * 1.6);
			ctx.stroke();
			s.x += s.speed * speed;
			if (s.x > width + MAX_LINE) Object.assign(s, spawn(true));
		}
	}

	function tick() {
		t += 1;
		drawFrame(1);
		raf = requestAnimationFrame(tick);
	}

	function onPointerMove(e: PointerEvent) {
		mouse.y = e.clientY / window.innerHeight;
		mouse.active = true;
	}

	function onPointerOut() {
		mouse.active = false;
	}

	onMount(() => {
		resize();
		window.addEventListener('resize', resize);
		if (!reduced) {
			window.addEventListener('pointermove', onPointerMove, { passive: true });
			window.addEventListener('pointerout', onPointerOut);
			raf = requestAnimationFrame(tick);
		}
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('resize', resize);
			window.removeEventListener('pointermove', onPointerMove);
			window.removeEventListener('pointerout', onPointerOut);
		};
	});
</script>

<canvas class="wind" bind:this={canvas} aria-hidden="true"></canvas>

<style>
	.wind {
		position: fixed;
		inset: 0;
		z-index: 1;
		pointer-events: none;
	}
</style>