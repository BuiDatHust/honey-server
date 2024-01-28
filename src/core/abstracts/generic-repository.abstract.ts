import { TPaginateOption } from '@core/type/paginate-option.type'
import { PopulateOptions } from 'mongoose'

// todo: write adapter from type generic repo to each implement repo of database
export abstract class IGenericRepository<T> {
  abstract getAll(): Promise<T[]>

  abstract getById(id: any): Promise<T>

  abstract create(item: T): Promise<T>

  abstract update(id: any, item: any)

  abstract deleteByField(filter)

  abstract getOne(filter): Promise<T>

  abstract getOneWithPopulateField(filter, populates: PopulateOptions[]): Promise<T>

  abstract updateByFilter(filter, item)

  abstract getAllByPaginate({
    filter,
    option,
    populates,
  }: {
    filter
    option: TPaginateOption
    populates?: PopulateOptions[]
  }): Promise<T[]>

  abstract getByFilterWithPopulateField(filter: any, populateFields: string): Promise<T[]>
}
