import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button.tsx"

// TODO: RAPH COMPONENT, DOCUMENT IT

export function DefaultNotFound() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-2 space-y-2 p-2">
      <h1 className="text-4xl font-bold">404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <p className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={() => window.history.back()}>
          Go back
        </Button>
        <Button asChild variant="secondary">
          <Link to="/">Home</Link>
        </Button>
      </p>
    </div>
  )
}
