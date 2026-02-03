import {json, type RequestHandler} from '@sveltejs/kit';
import { auth } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { email, password } = await request.json();

		if (!email || !password) {
			return json({ error: 'Email and password are required' }, { status: 400 });
		}

		const response = await auth.api.signInEmail({
			body: {
				email,
				password
			}
		});

		return json(response);
	} catch (error: any) {
		console.error('Login API error:', error);
		return json({ error: error.message || 'Internal Server Error' }, { status: 500 });
	}
};
