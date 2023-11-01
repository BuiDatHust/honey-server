import { ClassConstructor, classToPlain, plainToClass } from '@nestjs/class-transformer'

export function toPlain<T, V>(class_constructor: ClassConstructor<T>, data: V) {
  const instance = plainToClass(class_constructor, data, {
    ignoreDecorators: true,
  })
  const result = classToPlain(instance, {
    exposeUnsetFields: false,
  })
  return result
}
