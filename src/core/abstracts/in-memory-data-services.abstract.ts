export abstract class IInMemoryDataServices {
  abstract setKey(key: string, value: string | number | Buffer): Promise<void>
  abstract getKey(key: string): Promise<string>
  abstract deleteKey(key: string): Promise<void>
  abstract createCuckooFilter(filter_name: string, capacity?: number)
  abstract addToCuckooFilter(filter_name: string, value)
  abstract checkExistCuckooFilter(filter_name: string, value)
  abstract getUserKeyName(user_id: string, prefixKey: string): string
}
