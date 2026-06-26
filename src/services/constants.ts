export const REST_SERVER_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:9000'

export const PAGINATION_CONFIG = {
  enabled: import.meta.env.VITE_PAGINATION_ENABLED === 'true',
}

export interface PaginationData {
  page: number
  limit: number
}
