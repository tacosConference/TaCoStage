import { json } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const authHeader = request.headers.get('Authorization');
	const secret = env.ADMIN_SECRET;

	if (!secret || authHeader !== `Bearer ${secret}`) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { email, password, name } = await request.json();

	if (!email || !password || !name) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}

	try {
		// Create the user with Better Auth API
		// Better Auth admin plugin allows setting the role if using the server-side API properly
		const user = await auth.api.createUser({
			body: {
				email,
				password,
				name,
				role: 'admin'
			}
		});

		return json({ success: true, user });
	} catch (error: any) {
		console.error('Error creating admin:', error);
		return json({ error: error.message || 'Internal Server Error' }, { status: 500 });
	}
};
