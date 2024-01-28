import { MongoDataServicesModule } from '@frameworks/data-servies/mongodb/mongo-data-services.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [MongoDataServicesModule],
  exports: [MongoDataServicesModule],
})
export class DataServicesModule {}
