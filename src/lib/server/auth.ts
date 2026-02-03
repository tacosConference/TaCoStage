import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import {db} from "$lib/server/db";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    emailAndPassword: {
        enabled: true
    },
    session: {
        expiresIn: 60 * 60 * 24 // 1 day
    },
    plugins: [
        admin({
            defaultRole: "user",
            adminRoles: ["admin"]
        })
    ]
});