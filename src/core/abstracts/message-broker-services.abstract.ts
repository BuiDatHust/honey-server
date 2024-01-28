export abstract class IMessageBrokerService {
  abstract publish(queue: string, payload: string): Promise<boolean>
}
