import { TPaginateOption } from '@core/type/paginate-option.type'

export abstract class IGenericRepository<T> {
  abstract getAll(): Promise<T[]>

  abstract getById(id: any): Promise<T>

  abstract create(item: T): Promise<T>

  abstract update(id: any, item: any)

  abstract deleteByField(filter)

  abstract getOne(filter): Promise<T>

  abstract getOneWithPopulateField(
    filter,
    fields: { path: string; include?: string; strictPopulate?: boolean }[],
  ): Promise<T>

  abstract updateByFilter(filter, item)

  abstract getAllByPaginate(filter, option: TPaginateOption)
}
