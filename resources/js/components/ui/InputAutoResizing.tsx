import * as React from "react"
import { cn } from "@/lib/utils"

function AutoResizeInput({ className, type = "text", ...props }: React.ComponentProps<"textarea">) {
  const [value, setValue] = React.useState("")

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto"
    e.target.style.height = `${e.target.scrollHeight}px`
  }

  return (
    <textarea
      {...props}
      value={value}
      onChange={handleChange}
      onInput={handleInput}
      data-slot="input"
      className={cn(
        "resize-none border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
    />
  )
}

export { AutoResizeInput }
