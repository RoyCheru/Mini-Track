"use client"

import { useState } from "react"
import { FAQS } from "@/lib/faqs"
import { ChevronDown } from "lucide-react"

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="space-y-4">
      {FAQS.map((item, idx) => {
        const open = openIndex === idx

        return (
          <div
            key={item.q}
            className="rounded-2xl bg-white/80 px-6 py-5 ring-1 ring-brand-100 shadow-sm backdrop-blur transition-all hover:shadow-md"
          >
            <button
              className="flex w-full items-center justify-between gap-4 text-left"
              onClick={() => setOpenIndex(open ? null : idx)}
            >
              <span className="text-lg font-extrabold text-slate-900">{item.q}</span>
              <ChevronDown
                className={[
                  "h-5 w-5 text-slate-500 transition-transform",
                  open ? "rotate-180" : "rotate-0",
                ].join(" ")}
              />
            </button>

            {open ? <p className="mt-4 text-slate-700">{item.a}</p> : null}
          </div>
        )
      })}
    </div>
  )
}
