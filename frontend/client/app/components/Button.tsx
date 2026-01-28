import Link from "next/link"
import type { ComponentProps } from "react"

type Variant = "primary" | "ghost"

type ButtonAsButtonProps = ComponentProps<"button"> & {
  variant?: Variant
  href?: never
}

type ButtonAsLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant
  href: string
}

type Props = ButtonAsButtonProps | ButtonAsLinkProps

function cx(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ")
}

export default function Button(props: Props) {
  const variant = props.variant ?? "primary"

  const className = cx(
    "btn",
    variant === "primary" ? "btn-primary" : "btn-ghost",
    // allow extra classes
    "className" in props ? props.className : undefined
  )

  if ("href" in props) {
    const { href, ...rest } = props
    return <Link href={href} {...rest} className={className} />
  }

  const { variant: _v, ...rest } = props
  return <button {...rest} className={className} />
}
