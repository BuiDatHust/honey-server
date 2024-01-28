import { IGenericRepository } from '@core/abstracts/generic-repository.abstract'
import { TPaginateOption } from '@core/type/paginate-option.type'
import { Model, PopulateOptions } from 'mongoose'

export class MongoGenericRepository<T> implements IGenericRepository<T> {
  private _repository: Model<T>
  private _populateOnFind: string[]

  constructor(repository: Model<T>, populateOnFind: string[] = []) {
    this._repository = repository
    this._populateOnFind = populateOnFind
  }

  getAll(): Promise<T[]> {
    return this._repository.find().populate(this._populateOnFind).exec()
  }

  getById(id: any): Promise<any> {
    return this._repository.findById(id).lean().populate(this._populateOnFind).exec()
  }

  create(item: T): Promise<T> {
    return this._repository.create(item)
  }

  update(id: string, item) {
    return this._repository.findByIdAndUpdate(id, item)
  }

  updateByFilter(filter, item) {
    return this._repository.findOneAndUpdate(filter, item)
  }

  deleteByField(filter) {
    return this._repository.deleteMany(filter)
  }

  getOne(filter): Promise<T> {
    return this._repository.findOne(filter).lean()
  }

  getOneWithPopulateField(filter, populates: PopulateOptions[]): Promise<T> {
    return this._repository.findOne(filter).populate(populates).lean()
  }

  getAllByPaginate({
    filter,
    option,
    populates,
  }: {
    filter
    option: TPaginateOption
    populates?: PopulateOptions[]
  }): Promise<T[]> {
    if (!populates) {
      return this._repository.find(filter).limit(option.limit).sort(option.order).lean()
    }

    return this._repository
      .find(filter)
      .limit(option.limit)
      .sort(option.order)
      .populate(populates)
      .lean()
  }

  getByFilterWithPopulateField(filter: any, populateFields: string): Promise<T[]> {
    if (!populateFields) {
      return this._repository.find(filter).lean()
    }
    return this._repository.find(filter).lean().populate(populateFields)
  }
}
