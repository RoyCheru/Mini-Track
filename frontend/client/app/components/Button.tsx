"use client"

import Link from "next/link"
import type React from "react"
import type { UrlObject } from "url"

type Href = string | UrlObject

type CommonProps = {
  children: React.ReactNode
  className?: string
}

type LinkVariantProps = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: Href
  }

type ButtonVariantProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never
  }

type ButtonProps = LinkVariantProps | ButtonVariantProps

export default function Button(props: ButtonProps) {
  const { children, className, ...rest } = props

  if ("href" in props) {
    const { href, ...linkRest } = rest as Omit<LinkVariantProps, keyof CommonProps>

    return (
      <Link href={href} className={className} {...linkRest}>
        {children}
      </Link>
    )
  }

  return (
    <button className={className} {...(rest as Omit<ButtonVariantProps, keyof CommonProps>)}>
      {children}
    </button>
  )
}
