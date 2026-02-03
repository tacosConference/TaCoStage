import type {LayoutServerLoad} from './$types';
import {generateColor} from "$lib/util";
import { auth } from '$lib/server/auth';

export const load: LayoutServerLoad = async ({cookies, request}) => {
    let color = cookies.get('color');
    if (!color) {
        color = generateColor();
        cookies.set("color", color, {
            path: '/',
            maxAge: 60 * 60 * 24,
            httpOnly: false,
            sameSite: 'lax'
        });
    }

    const session = await auth.api.getSession({
        headers: request.headers
    });

    return {color, session};
};