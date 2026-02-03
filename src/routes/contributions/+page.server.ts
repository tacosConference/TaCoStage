import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { contributions } from '$lib/server/db/schema/contributions';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	try {
		// Fetch only approved contributions
		const approvedContributions = await db
			.select()
			.from(contributions)
			.where(eq(contributions.status, 'approved'))
			.orderBy(contributions.createdAt);

		return {
			contributions: approvedContributions
		};
	} catch (error) {
		console.error('Error fetching contributions:', error);
		return {
			contributions: []
		};
	}
};

