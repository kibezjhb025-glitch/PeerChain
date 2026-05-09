const pendingRequests = new Map<string, Promise<any>>()
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 30_000

export async function dedupFetch<T>(url: string, options?: RequestInit): Promise<{ success: boolean; data: T; error?: string }> {
  const cached = cache.get(url)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }

  if (pendingRequests.has(url)) {
    return pendingRequests.get(url)!
  }

  const promise = fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  })
    .then(async (res) => {
      const json = await res.json()
      cache.set(url, { data: json, timestamp: Date.now() })
      return json
    })
    .finally(() => {
      pendingRequests.delete(url)
    })

  pendingRequests.set(url, promise)
  return promise
}

export function invalidateCache(url: string) {
  cache.delete(url)
}

export function clearCache() {
  cache.clear()
}
