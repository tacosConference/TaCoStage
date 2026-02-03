import type { Handle, ResolveOptions } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';

export const handle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		const resolveWithLocale = (ev: typeof event, opts?: ResolveOptions) =>
			resolve(ev, {
				...(opts ?? {}),
				transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
			});

		return svelteKitHandler({ event, resolve: resolveWithLocale, auth, building });
	});