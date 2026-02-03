import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { contributions } from '$lib/server/db/schema/contributions';
import { eq } from 'drizzle-orm';
import { auth } from '$lib/server/auth';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	try {
		let query;

		if (session) {
			// Fetch all contributions for signed-in users (approved, pending, rejected)
			query = db.select().from(contributions);
		} else {
			// Fetch only approved contributions for guests
			query = db.select().from(contributions).where(eq(contributions.status, 'approved'));
		}

		const results = await query.orderBy(contributions.createdAt);

		return {
			contributions: results,
			session
		};
	} catch (err) {
		console.error('Error fetching contributions:', err);
		return {
			contributions: [],
			session
		};
	}
};

export const actions: Actions = {
	updateStatus: async ({ request }) => {
		const session = await auth.api.getSession({
			headers: request.headers
		});

		if (!session) {
			throw error(401, 'Unauthorized');
		}

		const formData = await request.formData();
		const id = Number(formData.get('id'));
		const status = formData.get('status') as string;

		if (!id || !['approved', 'rejected', 'pending'].includes(status)) {
			throw error(400, 'Invalid request');
		}

		await db
			.update(contributions)
			.set({ status })
			.where(eq(contributions.id, id));

		return { success: true };
	}
};

