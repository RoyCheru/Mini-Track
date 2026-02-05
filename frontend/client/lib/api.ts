// const BASE_URL = process.env.NEXT_PUBLIC_API_URL

// export async function apiFetch(
//   path: string,
//   options: RequestInit = {}
// ) {
//   const response = await fetch(`${BASE_URL}${path}`, {
//     ...options,
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//       ...(options.headers || {}),
//     },
//   })

//   return response
// }

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5555"

// export async function apiFetch(path: string, options: RequestInit = {}) {
//   const normalizedPath = path.startsWith("/") ? path : `/${path}`
//   const url = `${BASE_URL}${normalizedPath}`

//   console.log("[apiFetch]", options.method || "GET", url)

//   const response = await fetch(url, {
//     ...options,
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//       ...(options.headers || {}),
//     },
//   })

//   return response
// }


// src/lib/api.ts
const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5555").replace(/\/$/, "")

export async function apiFetch(path: string, options: RequestInit = {}) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  const url = `${BASE_URL}${normalizedPath}`

  console.log("[apiFetch]", options.method || "GET", url)

  const res = await fetch(url, {
    ...options,
    // ✅ You said auth is not cookie-based. Remove this to avoid cookie/CORS weirdness.
    // credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  })

  // ✅ Make errors loud (so you don't silently render empty UI)
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    let message = `Request failed: ${res.status} ${res.statusText}`

    // Try parse JSON error if possible
    try {
      const j = text ? JSON.parse(text) : null
      message = j?.error || j?.message || message
    } catch {
      if (text) message = text
    }

    throw new Error(message)
  }

  return res
}
