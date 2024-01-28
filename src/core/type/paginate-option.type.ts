export type OrderOption = Record<string, 1 | -1>

export type TPaginateOption = {
  cursor?: string
  limit: number
  order: OrderOption
}
