export abstract class IMqttClientService {
  abstract publish(topic: string, payload: string): string
}
