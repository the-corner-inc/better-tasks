import {TaskModel} from "@/routes/(app)/_auth/tasks/-feature/tasks.dm.ts";
import {Link} from "@tanstack/react-router";
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";

export function TaskList({ tasks }: {tasks: TaskModel[] }) {

    // If no tasks to show
    if(!tasks.length) {{
        return (
            <div className="text-sm text-muted-foreground">
                You don't have any task yet
            </div>
        )
    }}

    // Show tasks
    return (
        <div className="grid gap-4">
            {
                tasks.map((task) => (
                    <Link
                        key={task.id}
                        to="/tasks/$id"
                        params={{ id: task.id }}
                        className="block"
                    >
                        <Card className="hover:bg-muted/30 transition-colors">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    {task.title}
                                </CardTitle>
                                <CardDescription>
                                    Updated: {new Date(task.updatedAt).toLocaleString()}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))
            }
        </div>
    )
}