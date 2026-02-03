import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

async function createAdmin() {
    const args = process.argv.slice(2);
    const email = args[0];
    const name = args[1] || "Admin";

    if (!email) {
        console.log("Usage: pnpm db:admin <email> [name]");
        process.exit(1);
    }

    const secret = process.env.ADMIN_SECRET;
    const baseUrl = process.env.BETTER_AUTH_BASE_URL || 'http://localhost:5173';

    if (!secret) {
        console.error("ADMIN_CREATION_SECRET is not set in .env");
        process.exit(1);
    }

    const password = crypto.randomBytes(16).toString('hex');

    try {
        const response = await fetch(`${baseUrl}/api/admin/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${secret}`
            },
            body: JSON.stringify({
                email,
                password,
                name
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || `HTTP error! status: ${response.status}`);
        }

        console.log("Admin account created successfully!");
        console.log("-----------------------------------");
        console.log(`Email:    ${email}`);
        console.log(`Password: ${password}`);
        console.log(`Name:     ${name}`);
        console.log("-----------------------------------");
        console.log("Please save this password securely.");
    } catch (error: any) {
        console.error("Failed to create admin account:");
        console.error(error.message || error);
        console.error("\nMake sure the SvelteKit server is running at", baseUrl);
    }
}

createAdmin();
