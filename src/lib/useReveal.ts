/**
 * Adds `.is-visible` when the element scrolls into view (one-shot).
 * Usage: <div class="reveal" use:useReveal>
 */
export function useReveal(el: HTMLElement) {
	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					el.classList.add('is-visible');
					io.unobserve(el);
				}
			}
		},
		{ threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
	);
	io.observe(el);
	return { destroy: () => io.disconnect() };
}