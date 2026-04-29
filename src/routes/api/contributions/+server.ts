import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { contributions } from '$lib/server/db/schema/contributions';
import { auth } from '$lib/server/auth';
import { eq } from 'drizzle-orm';

const MAX_TITLE_LENGTH = 200;
const MAX_ABSTRACT_LENGTH = 2000;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 255;
const MAX_CAPTCHA_LENGTH = 100;
const MIN_TITLE_LENGTH = 5;
const MIN_ABSTRACT_LENGTH = 50;
const MIN_NAME_LENGTH = 2;
const ALLOWED_CONTRIBUTION_TYPES = ['talk', 'workshop_30', 'workshop_60', 'lightning', 'other'];

export const POST: RequestHandler = async ({ request, url }) => {
	try {
		const session = await auth.api.getSession({
			headers: request.headers
		});

		const idParam = url.searchParams.get('id');
		const isEditMode = !!idParam;

		const contentLength = request.headers.get('content-length');
		// Reject requests larger than 50kb
		if (contentLength && parseInt(contentLength) > 50000) {
			return json(
				{ success: false, message: 'Request too large' },
				{ status: 413 }
			);
		}

		const data = await request.json();

		// Validate required fields
		const { type, title, abstract, name, email, captcha } = data;

		if (!type || !title || !abstract || !name || !email || (!captcha && !isEditMode)) {
			return json(
				{ success: false, message: 'All fields are required' },
				{ status: 400 }
			);
		}

		if (isEditMode) {
			if (!session) {
				return json({ success: false, message: 'Unauthorized' }, { status: 401 });
			}

			const id = Number(idParam);
			if (isNaN(id)) {
				return json({ success: false, message: 'Invalid contribution ID' }, { status: 400 });
			}

			// Validate types for fields that might be present
			if (typeof type !== 'string' || typeof title !== 'string' ||
				typeof abstract !== 'string' || typeof name !== 'string' ||
				typeof email !== 'string') {
				return json(
					{ success: false, message: 'Invalid data format' },
					{ status: 400 }
				);
			}
		} else {
			if (typeof type !== 'string' || typeof title !== 'string' ||
				typeof abstract !== 'string' || typeof name !== 'string' ||
				typeof email !== 'string' || typeof captcha !== 'string') {
				return json(
					{ success: false, message: 'Invalid data format' },
					{ status: 400 }
				);
			}
		}

		if (!ALLOWED_CONTRIBUTION_TYPES.includes(type.toLowerCase())) {
			return json(
				{ success: false, message: 'Invalid contribution type' },
				{ status: 400 }
			);
		}
		if (title.length > MAX_TITLE_LENGTH) {
			return json(
				{ success: false, message: `Title must be at most ${MAX_TITLE_LENGTH} characters` },
				{ status: 400 }
			);
		}
		if (abstract.length > MAX_ABSTRACT_LENGTH) {
			return json(
				{ success: false, message: `Abstract must be at most ${MAX_ABSTRACT_LENGTH} characters` },
				{ status: 400 }
			);
		}
		if (name.length > MAX_NAME_LENGTH) {
			return json(
				{ success: false, message: `Name must be at most ${MAX_NAME_LENGTH} characters` },
				{ status: 400 }
			);
		}
		if (email.length > MAX_EMAIL_LENGTH) {
			return json(
				{ success: false, message: `Email must be at most ${MAX_EMAIL_LENGTH} characters` },
				{ status: 400 }
			);
		}

		if (!isEditMode) {
			if (captcha.length > MAX_CAPTCHA_LENGTH) {
				return json(
					{ success: false, message: 'Captcha answer is too long' },
					{ status: 400 }
				);
			}
		}

		if (title.trim().length < MIN_TITLE_LENGTH) {
			return json(
				{ success: false, message: `Title must be at least ${MIN_TITLE_LENGTH} characters` },
				{ status: 400 }
			);
		}
		if (abstract.trim().length < MIN_ABSTRACT_LENGTH) {
			return json(
				{ success: false, message: `Abstract must be at least ${MIN_ABSTRACT_LENGTH} characters` },
				{ status: 400 }
			);
		}
		if (name.trim().length < MIN_NAME_LENGTH) {
			return json(
				{ success: false, message: `Name must be at least ${MIN_NAME_LENGTH} characters` },
				{ status: 400 }
			);
		}

		if (!isEditMode) {
			const captchaLower = captcha.toLowerCase().trim();
			if (!captchaLower.includes('heidelberg')) {
				return json(
					{ success: false, message: 'Captcha answer is incorrect. Question is: Where will the TaCoS 2026 be held?' },
					{ status: 400 }
				);
			}
		}

		if (isEditMode) {
			const id = Number(idParam);
			await db
				.update(contributions)
				.set({
					type: type.toLowerCase(),
					title,
					abstract,
					name,
					email
				})
				.where(eq(contributions.id, id));

			return json({
				success: true,
				message: 'Contribution updated successfully'
			});
		} else {
			// Insert contribution into database
			const [newContribution] = await db.insert(contributions).values({
				type: type.toLowerCase(),
				title,
				abstract,
				name,
				email,
				status: 'pending'
			}).returning();

			return json({
				success: true,
				message: 'Your contribution has been submitted successfully.',
				id: newContribution.id
			});
		}

	} catch (error) {
		console.error('Error submitting contribution:', error);
		return json(
			{ success: false, message: 'An error occurred while submitting your contribution. Please try again.' },
			{ status: 500 }
		);
	}
};

