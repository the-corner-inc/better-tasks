ALTER TABLE "todos_table" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "todos_table" CASCADE;--> statement-breakpoint
ALTER TABLE "tasks_table" RENAME TO "tasks";--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "created_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "updated_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;