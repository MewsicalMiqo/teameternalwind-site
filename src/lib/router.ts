import { writable } from 'svelte/store';

export type Route = 'home' | 'rules';

function parseRoute(): Route {
	const hash = window.location.hash.replace(/^#\/?/, '');
	return hash.startsWith('rules') ? 'rules' : 'home';
}

const initial = typeof window !== 'undefined' ? parseRoute() : 'home';
export const route = writable<Route>(initial);

let current = initial;
route.subscribe((value) => {
	current = value;
});

export function navigate(to: Route, section?: string) {
	if (to === current) {
		// already on this route — jump to section if asked
		if (section) scrollToSection(section);
		return;
	}
	window.location.hash = to === 'rules' ? '/rules' : '/';
	if (section) {
		// wait for the home view to mount before scrolling
		requestAnimationFrame(() => requestAnimationFrame(() => scrollToSection(section)));
	}
}

function scrollToSection(id: string) {
	const el = document.getElementById(id);
	if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function startRouter(): () => void {
	const onHashChange = () => route.set(parseRoute());
	window.addEventListener('hashchange', onHashChange);
	return () => window.removeEventListener('hashchange', onHashChange);
}