import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState<boolean>(() => {
		if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
			return false;
		}
		return window.matchMedia(query).matches;
	});

	useEffect(() => {
		if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
			return;
		}
		const mediaQueryList = window.matchMedia(query);
		const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

		// Set initial state and subscribe
		setMatches(mediaQueryList.matches);
		mediaQueryList.addEventListener('change', handler);
		return () => mediaQueryList.removeEventListener('change', handler);
	}, [query]);

	return matches;
}


