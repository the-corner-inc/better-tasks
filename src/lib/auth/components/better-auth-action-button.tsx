import { ActionButton } from "@/components/ui/action-button"
import type { ComponentProps } from "react"

export function BetterAuthActionButton({
  action,
  successMessage,
  ...props
}: Omit<ComponentProps<typeof ActionButton>, "action"> & {
  action: () => Promise<{ error: null | { message?: string } }>
  successMessage?: string
}) {
  return (
    <ActionButton
      /* eslint-disable-next-line @eslint-react/no-implicit-key */
      {...props}
      action={async () => {
        const result = await action()

        if (result.error) {
          return {
            error: true,
            message: result.error.message || "Action failed",
          }
        } else {
          return { error: false, message: successMessage }
        }
      }}
    />
  )
}
