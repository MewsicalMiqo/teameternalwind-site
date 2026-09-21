<script lang="ts">
	import { onMount } from 'svelte';

	const COUNT = 56; // flowing wind particles
	const TRAIL = 32; // trail points kept per particle
	const BLOBS = 5; // ambient moving-gradient blobs
	const MAX_LEAVES = 6;
	const FIELD_SCALE = 0.0016; // spatial frequency of the flow field
	const TIME_SCALE = 0.0011; // how quickly the field itself evolves
	const WIND_BIAS = 0.03; // gentle constant rightward push (the "wind")

	let canvas = $state<HTMLCanvasElement | null>(null);
	let ctx: CanvasRenderingContext2D | null = null;
	let width = 0;
	let height = 0;
	let raf = 0;
	let t = 0;
	let leafTimer = 240;

	const reduced =
		typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

	interface Particle {
		x: number;
		y: number;
		vx: number;
		vy: number;
		hue: number;
		alpha: number;
		width: number;
		life: number;
		trail: number[]; // flat [x0,y0,x1,y1,...] oldest first
	}

	interface Blob {
		bx: number; // base x as a fraction of width
		by: number; // base y as a fraction of height
		r: number; // radius in px
		hue: number;
		spd: number;
		ph: number;
	}

	interface Leaf {
		x: number;
		baseY: number;
		vx: number;
		swayAmp: number;
		swayFreq: number;
		swayPhase: number;
		size: number;
		rot: number;
		rotSpeed: number;
		flutAmp: number;
		flutFreq: number;
		flutPhase: number;
		hue: number;
		alpha: number;
	}

	let parts: Particle[] = [];
	let blobs: Blob[] = [];
	let leaves: Leaf[] = [];
	const mouse = { y: 0.5, active: false };

	const random = (min: number, max: number) => min + Math.random() * (max - min);

	function spawnP(): Particle {
		return {
			x: random(-60, width + 60),
			y: random(0, height),
			vx: WIND_BIAS * 10 + random(-0.2, 0.2),
			vy: random(-0.15, 0.15),
			hue: random(185, 270), // cyan ↔ violet
			alpha: random(0.05, 0.13),
			width: random(1, 1.9),
			life: random(320, 720),
			trail: [],
		};
	}

	function spawnBlob(): Blob {
		const base = Math.max(width, height) || 800;
		return {
			bx: random(0.15, 0.85),
			by: random(0.15, 0.85),
			r: random(0.34, 0.6) * base,
			hue: random(190, 275), // cyan ↔ violet
			spd: random(0.0009, 0.0022),
			ph: random(0, Math.PI * 2),
		};
	}

	function spawnLeaf(): Leaf {
		return {
			x: -random(50, 110),
			baseY: random(height * 0.08, height * 0.92),
			vx: random(0.3, 0.85),
			swayAmp: random(12, 34),
			swayFreq: random(0.006, 0.016),
			swayPhase: random(0, Math.PI * 2),
			size: random(9, 20),
			rot: random(-0.7, 0.7),
			rotSpeed: random(-0.01, 0.012),
			flutAmp: random(0.3, 0.8),
			flutFreq: random(0.02, 0.05),
			flutPhase: random(0, Math.PI * 2),
			hue: random(138, 192), // mint ↔ teal
			alpha: random(0.45, 0.8),
		};
	}

	// --- Smooth 3D value noise → an organic, time-evolving flow field ---------
	const PERM = new Uint8Array(512);
	(function seed() {
		const p = new Uint8Array(256);
		for (let i = 0; i < 256; i++) p[i] = i;
		let s = 1337;
		const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
		for (let i = 255; i > 0; i--) {
			const j = Math.floor(rnd() * (i + 1));
			const tmp = p[i];
			p[i] = p[j];
			p[j] = tmp;
		}
		for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
	})();

	const fade = (v: number) => v * v * (3 - 2 * v);
	const lerp = (a: number, b: number, v: number) => a + (b - a) * v;
	const grad = (h: number, x: number, y: number, z: number) => {
		const hh = h & 15;
		const u = hh < 8 ? x : y;
		const w = hh < 4 ? y : hh === 12 || hh === 14 ? x : z;
		return ((hh & 1) === 0 ? u : -u) + ((hh & 2) === 0 ? w : -w);
	};

	function noise3(x: number, y: number, z: number): number {
		const X = Math.floor(x) & 255;
		const Y = Math.floor(y) & 255;
		const Z = Math.floor(z) & 255;
		x -= Math.floor(x);
		y -= Math.floor(y);
		z -= Math.floor(z);
		const u = fade(x);
		const v = fade(y);
		const w = fade(z);
		const A = PERM[X] + Y;
		const AA = PERM[A] + Z;
		const AB = PERM[A + 1] + Z;
		const B = PERM[X + 1] + Y;
		const BA = PERM[B] + Z;
		const BB = PERM[B + 1] + Z;
		return lerp(
			lerp(
				lerp(grad(PERM[AA], x, y, z), grad(PERM[BA], x - 1, y, z), u),
				lerp(grad(PERM[AB], x, y - 1, z), grad(PERM[BB], x - 1, y - 1, z), u),
				v
			),
			lerp(
				lerp(grad(PERM[AA + 1], x, y, z - 1), grad(PERM[BA + 1], x - 1, y, z - 1), u),
				lerp(grad(PERM[AB + 1], x, y - 1, z - 1), grad(PERM[BB + 1], x - 1, y - 1, z - 1), u),
				v
			),
			w
		);
	}

	function fieldAngle(x: number, y: number): number {
		return noise3(x * FIELD_SCALE, y * FIELD_SCALE, t * TIME_SCALE) * Math.PI * 1.2;
	}

	function stepParticles(speed: number) {
		for (let i = 0; i < parts.length; i++) {
			const p = parts[i];
			const a = fieldAngle(p.x, p.y);
			p.vx += (Math.cos(a) * 0.16 + WIND_BIAS) * speed;
			p.vy += Math.sin(a) * 0.16 * speed;
			p.vx *= 0.94;
			p.vy *= 0.94;
			const sp = Math.hypot(p.vx, p.vy);
			const maxSp = 1.7;
			if (sp > maxSp) {
				p.vx = (p.vx / sp) * maxSp;
				p.vy = (p.vy / sp) * maxSp;
			}
			p.x += p.vx * speed;
			p.y += p.vy * speed;
			p.trail.push(p.x, p.y);
			if (p.trail.length > TRAIL * 2) p.trail.splice(0, p.trail.length - TRAIL * 2);
			p.life -= speed;
			const m = 90;
			if (p.life <= 0 || p.x < -m || p.x > width + m || p.y < -m || p.y > height + m) {
				parts[i] = spawnP();
			}
		}
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
		parts = Array.from({ length: COUNT }, spawnP);
		blobs = Array.from({ length: BLOBS }, spawnBlob);
		leaves = [];
		leafTimer = random(120, 320);
		for (let i = 0; i < 30; i++) stepParticles(1); // warm up so trails are visible
		drawFrame(1);
	}

	function drawTrail(p: Particle, parallax: number) {
		if (!ctx) return;
		const n = p.trail.length / 2;
		if (n < 3) return;
		const x0 = p.trail[0];
		const y0 = p.trail[1];
		const x1 = p.trail[p.trail.length - 2];
		const y1 = p.trail[p.trail.length - 1];
		if (Math.abs(x1 - x0) < 2 && Math.abs(y1 - y0) < 2) return; // still just a dot

		// fade in from the tail → bright head
		const grad = ctx.createLinearGradient(x0, y0 + parallax, x1, y1 + parallax);
		grad.addColorStop(0, `hsla(${p.hue}, 88%, 74%, 0)`);
		grad.addColorStop(1, `hsla(${p.hue}, 90%, 78%, ${p.alpha})`);

		ctx.beginPath();
		ctx.moveTo(x0, y0 + parallax);
		for (let i = 1; i < n - 1; i++) {
			const cx = p.trail[i * 2];
			const cy = p.trail[i * 2 + 1] + parallax;
			const mx = (cx + p.trail[(i + 1) * 2]) / 2;
			const my = (cy + p.trail[(i + 1) * 2 + 1] + parallax) / 2;
			ctx.quadraticCurveTo(cx, cy, mx, my);
		}
		ctx.lineTo(x1, y1 + parallax);

		ctx.strokeStyle = grad;
		ctx.globalAlpha = 0.35;
		ctx.lineWidth = p.width * 3.4; // soft glow
		ctx.stroke();
		ctx.globalAlpha = 1;
		ctx.lineWidth = p.width; // gentle core
		ctx.stroke();
	}

	function drawBlobs() {
		if (!ctx) return;
		for (const b of blobs) {
			const ph = t * b.spd + b.ph;
			const x = b.bx * width + Math.cos(ph) * width * 0.08;
			const y = b.by * height + Math.sin(ph * 0.7) * height * 0.07;
			const g = ctx.createRadialGradient(x, y, 0, x, y, b.r);
			g.addColorStop(0, `hsla(${b.hue}, 80%, 62%, 0.10)`);
			g.addColorStop(0.55, `hsla(${b.hue}, 80%, 60%, 0.05)`);
			g.addColorStop(1, `hsla(${b.hue}, 80%, 60%, 0)`);
			ctx.fillStyle = g;
			ctx.fillRect(0, 0, width, height);
		}
	}

	function drawLeaf(l: Leaf, y: number, rot: number, alpha: number) {
		if (!ctx) return;
		const L = l.size;
		ctx.save();
		ctx.translate(l.x, y);
		ctx.rotate(rot);
		ctx.globalAlpha = alpha;

		const fill = ctx.createLinearGradient(-L, 0, L, 0);
		fill.addColorStop(0, `hsla(${l.hue}, 55%, 56%, 0.9)`);
		fill.addColorStop(1, `hsla(${l.hue + 22}, 62%, 74%, 0.95)`);
		ctx.fillStyle = fill;
		ctx.beginPath();
		ctx.moveTo(-L, 0);
		ctx.quadraticCurveTo(-L * 0.15, -L * 0.85, L, 0);
		ctx.quadraticCurveTo(-L * 0.15, L * 0.85, -L, 0);
		ctx.closePath();
		ctx.fill();

		ctx.strokeStyle = `hsla(${l.hue + 30}, 45%, 38%, 0.55)`;
		ctx.lineWidth = 0.9;
		ctx.beginPath();
		ctx.moveTo(-L * 0.8, 0);
		ctx.quadraticCurveTo(0, -L * 0.2, L * 0.8, 0);
		ctx.stroke();
		ctx.restore();
	}

	function drawFrame(speed: number) {
		if (!ctx) return;
		ctx.clearRect(0, 0, width, height);
		const parallax = mouse.active ? (mouse.y - 0.5) * 14 : 0;

		drawBlobs();
		stepParticles(speed);
		for (const p of parts) drawTrail(p, parallax);

		// occasional drifting leaves
		if (leaves.length < MAX_LEAVES) {
			leafTimer -= speed;
			if (leafTimer <= 0) {
				leaves.push(spawnLeaf());
				leafTimer = random(240, 660);
			}
		}
		for (let i = leaves.length - 1; i >= 0; i--) {
			const l = leaves[i];
			const sway = Math.sin(t * l.swayFreq + l.swayPhase) * l.swayAmp;
			const rot = l.rot + Math.sin(t * l.flutFreq + l.flutPhase) * l.flutAmp;
			const edge = Math.max(0, Math.min(1, Math.min(l.x + 80, width - l.x + 80) / 140));
			if (edge > 0.02) drawLeaf(l, l.baseY + sway + parallax * 0.5, rot, l.alpha * edge);
			l.x += l.vx * speed;
			l.rot += l.rotSpeed * speed;
			if (l.x > width + 90) leaves.splice(i, 1);
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