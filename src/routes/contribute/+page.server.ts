import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { contributions } from '$lib/server/db/schema/contributions';
import { eq } from 'drizzle-orm';
import { auth } from '$lib/server/auth';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url, request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	const idParam = url.searchParams.get('id');
	
	if (idParam) {
		if (!session) {
			throw redirect(302, '/contribute');
		}

		const id = Number(idParam);
		if (isNaN(id)) {
			throw error(400, 'Invalid contribution ID');
		}

		const contribution = await db.query.contributions.findFirst({
			where: eq(contributions.id, id)
		});

		if (!contribution) {
			throw error(404, 'Contribution not found');
		}

		return {
			contribution,
			session
		};
	}

	return {
		contribution: null,
		session
	};
};
