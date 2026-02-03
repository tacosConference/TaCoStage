import { pgTable, serial, integer, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const contributions = pgTable('contributions', {
	id: serial('id').primaryKey(),
	type: varchar('type', { length: 50 }).notNull(),
	title: varchar('title', { length: 255 }).notNull(),
	abstract: text('abstract').notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	status: varchar('status', { length: 20 }).default('pending').notNull() // pending, approved, rejected
});

