// package: api
// file: user.proto

import * as jspb from "google-protobuf";

export class GetListRecommendUserRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  clearIdsList(): void;
  getIdsList(): Array<string>;
  setIdsList(value: Array<string>): void;
  addIds(value: string, index?: number): string;

  getLimit(): number;
  setLimit(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetListRecommendUserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetListRecommendUserRequest): GetListRecommendUserRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetListRecommendUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetListRecommendUserRequest;
  static deserializeBinaryFromReader(message: GetListRecommendUserRequest, reader: jspb.BinaryReader): GetListRecommendUserRequest;
}

export namespace GetListRecommendUserRequest {
  export type AsObject = {
    id: string,
    idsList: Array<string>,
    limit: number,
  }
}

export class GetListRecommendUserResponse extends jspb.Message {
  clearIdsList(): void;
  getIdsList(): Array<string>;
  setIdsList(value: Array<string>): void;
  addIds(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetListRecommendUserResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetListRecommendUserResponse): GetListRecommendUserResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetListRecommendUserResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetListRecommendUserResponse;
  static deserializeBinaryFromReader(message: GetListRecommendUserResponse, reader: jspb.BinaryReader): GetListRecommendUserResponse;
}

export namespace GetListRecommendUserResponse {
  export type AsObject = {
    idsList: Array<string>,
  }
}

export class CreateUserRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getSexualOrientation(): string;
  setSexualOrientation(value: string): void;

  getRelationshipGoal(): string;
  setRelationshipGoal(value: string): void;

  clearPassionsList(): void;
  getPassionsList(): Array<string>;
  setPassionsList(value: Array<string>): void;
  addPassions(value: string, index?: number): string;

  getPets(): string;
  setPets(value: string): void;

  getWorkout(): string;
  setWorkout(value: string): void;

  getSmoking(): string;
  setSmoking(value: string): void;

  getSleepingHabit(): string;
  setSleepingHabit(value: string): void;

  getScore(): number;
  setScore(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateUserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateUserRequest): CreateUserRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateUserRequest;
  static deserializeBinaryFromReader(message: CreateUserRequest, reader: jspb.BinaryReader): CreateUserRequest;
}

export namespace CreateUserRequest {
  export type AsObject = {
    id: string,
    sexualOrientation: string,
    relationshipGoal: string,
    passionsList: Array<string>,
    pets: string,
    workout: string,
    smoking: string,
    sleepingHabit: string,
    score: number,
  }
}

export class CreateUserResponse extends jspb.Message {
  getIsSuccess(): boolean;
  setIsSuccess(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateUserResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateUserResponse): CreateUserResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateUserResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateUserResponse;
  static deserializeBinaryFromReader(message: CreateUserResponse, reader: jspb.BinaryReader): CreateUserResponse;
}

export namespace CreateUserResponse {
  export type AsObject = {
    isSuccess: boolean,
  }
}

