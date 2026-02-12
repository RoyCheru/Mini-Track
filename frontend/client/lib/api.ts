const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5555").replace(/\/$/, "")

export async function apiFetch(path: string, options: RequestInit = {}) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  const url = `${BASE_URL}${normalizedPath}`

  console.log("[apiFetch]", options.method || "GET", url)

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    let message = `Request failed: ${res.status} ${res.statusText}`

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
