export class OrderAlreadyDeliveredError extends Error {
  constructor() {
    super('Cannot change the status of an already delivered order.')

    this.name = 'OrderAlreadyDeliveredError'
  }
}
