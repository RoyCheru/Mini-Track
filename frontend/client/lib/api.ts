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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5555"

export async function apiFetch(path: string, options: RequestInit = {}) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  const url = `${BASE_URL}${normalizedPath}`

  console.log("[apiFetch]", options.method || "GET", url)

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  })

  return response
}
