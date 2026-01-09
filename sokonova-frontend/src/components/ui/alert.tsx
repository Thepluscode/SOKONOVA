import { cva, type VariantProps } from "class-variance-authority"
import { clsx } from "clsx"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const alertTitleVariants = cva("mb-1 font-medium leading-none tracking-tight")

const alertDescriptionVariants = cva("text-sm [&_p]:leading-relaxed")

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

interface AlertTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof alertTitleVariants> {}

interface AlertDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof alertDescriptionVariants> {}

const Alert = ({ className, variant, ...props }: AlertProps) => (
  <div
    role="alert"
    className={clsx(alertVariants({ variant }), className)}
    {...props}
  />
)

const AlertTitle = ({ className, ...props }: AlertTitleProps) => (
  <h5
    className={clsx(alertTitleVariants(), className)}
    {...props}
  />
)

const AlertDescription = ({ className, ...props }: AlertDescriptionProps) => (
  <div
    className={clsx(alertDescriptionVariants(), className)}
    {...props}
  />
)

export { Alert, AlertTitle, AlertDescription }