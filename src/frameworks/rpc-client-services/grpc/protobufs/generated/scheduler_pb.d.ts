// package: scheduler
// file: scheduler.proto

import * as jspb from "google-protobuf";

export class SpeedUpMatchMakingRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): void;

  getSpeedUpLevel(): number;
  setSpeedUpLevel(value: number): void;

  getMatchMakingRequestId(): string;
  setMatchMakingRequestId(value: string): void;

  getTypeMatchMaking(): TypeMatchMakingMap[keyof TypeMatchMakingMap];
  setTypeMatchMaking(value: TypeMatchMakingMap[keyof TypeMatchMakingMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SpeedUpMatchMakingRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SpeedUpMatchMakingRequest): SpeedUpMatchMakingRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SpeedUpMatchMakingRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SpeedUpMatchMakingRequest;
  static deserializeBinaryFromReader(message: SpeedUpMatchMakingRequest, reader: jspb.BinaryReader): SpeedUpMatchMakingRequest;
}

export namespace SpeedUpMatchMakingRequest {
  export type AsObject = {
    userId: string,
    speedUpLevel: number,
    matchMakingRequestId: string,
    typeMatchMaking: TypeMatchMakingMap[keyof TypeMatchMakingMap],
  }
}

export class SpeedUpMatchMakingResponse extends jspb.Message {
  getStatus(): boolean;
  setStatus(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SpeedUpMatchMakingResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SpeedUpMatchMakingResponse): SpeedUpMatchMakingResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SpeedUpMatchMakingResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SpeedUpMatchMakingResponse;
  static deserializeBinaryFromReader(message: SpeedUpMatchMakingResponse, reader: jspb.BinaryReader): SpeedUpMatchMakingResponse;
}

export namespace SpeedUpMatchMakingResponse {
  export type AsObject = {
    status: boolean,
  }
}

export interface TypeMatchMakingMap {
  RANDOM_CHAT: 0;
  RANDOM_VOICE_CALL: 1;
}

export const TypeMatchMaking: TypeMatchMakingMap;

