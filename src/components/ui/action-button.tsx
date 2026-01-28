import { type ComponentProps, type ReactNode, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { LoadingSwap } from "@/components/ui/loading-swap"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type ActionResult = {
    error: boolean
    message?: string
}

type ActionButtonProps = ComponentProps<typeof Button> & {
    action: () => Promise<ActionResult | void>
    requireAreYouSure?: boolean
    areYouSureDescription?: ReactNode
}

export function ActionButton({
                                 action,
                                 requireAreYouSure = false,
                                 areYouSureDescription = "This action cannot be undone.",
                                 children,
                                 ...props
                             }: ActionButtonProps) {
    const [isLoading, startTransition] = useTransition()

    function performAction() {
        startTransition(async () => {
            const result = await action()
            if (result?.error) {
                toast.error(result.message ?? "Error")
            }
        })
    }

    if (requireAreYouSure) {
        return (
            <AlertDialog open={isLoading ? true : undefined}>
                <AlertDialogTrigger asChild>
                    <Button {...props}>{children}</Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {areYouSureDescription}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isLoading}
                            onClick={performAction}
                        >
                            <LoadingSwap isLoading={isLoading} className="flex gap-2 items-center">
                                Yes
                            </LoadingSwap>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )
    }

    return (
        <Button
            {...props}
            disabled={props.disabled ?? isLoading}
            onClick={(e) => {
                performAction()
                props.onClick?.(e)
            }}
        >
            <LoadingSwap
                isLoading={isLoading}
                className="inline-flex items-center gap-2"
            >
                {children}
            </LoadingSwap>
        </Button>
    )
}
