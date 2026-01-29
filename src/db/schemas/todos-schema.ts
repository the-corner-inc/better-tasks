import {boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'


/** TODO : EDIT FROM NEXTJS
 * Database schema definition for TASKS and TODOS
 *
 * This files defines :
 * - Table structures in the DB (columns, types, constraints)
 * - Index for query optimisation
 * - Relations for Drizzle's query builder
 *
 * Cardinality Rules (PK & FK):
 *  - 1:N → FK in table "N"
 *  - N:N → intermediary table with 2 FK
 *  - 1:1 → FK + UNIQUE
 */


// ======================================================
// Tables
// ======================================================
// "pgTable" accepts 2-3 args.
// - SQL Table name
// - Columns of the table to be defined
// - Optional : Extraconfig, define indexes and constraints
// ======================================================

export const todosTable = pgTable(
    'todos', {
        id: uuid("id").primaryKey().defaultRandom(),
        title: text("title").notNull(),
        isCompleted: boolean("is_completed").notNull(),
        createdAt: timestamp("created_at",{withTimezone: true}).defaultNow().notNull(),
        updatedAt: timestamp("updated_at",{withTimezone: true}).defaultNow().notNull().$onUpdate(() => new Date()),
    })


// ======================================================
// Relations
// ======================================================
// Relations : helps Drizzle to understand logic links, and allow easier & typed queries in the backend (via 'with').
// Relations do NOT create or modify anything in SQL (no FK, no constraints).
// ======================================================
