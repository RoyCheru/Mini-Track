"use client"
import { useState } from "react"
import { FAQS } from "@/lib/faqs"

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="space-y-4">
      {FAQS.map((item, idx) => {
        const open = openIndex === idx
        return (
          <div key={item.q} className="card px-6 py-5">
            <button
              className="flex w-full items-center justify-between text-left"
              onClick={() => setOpenIndex(open ? null : idx)}
            >
              <span className="text-lg font-bold">{item.q}</span>
              <span className="text-xl">{open ? "▴" : "▾"}</span>
            </button>
            {open ? <p className="mt-4 text-slate-600">{item.a}</p> : null}
          </div>
        )
      })}
    </div>
  )
}
