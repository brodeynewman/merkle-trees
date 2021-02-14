import crypto from 'crypto';

// Hashes data and returns a hex string
export const createHash = (data) => data && crypto.createHash('sha256').update(data.toString()).digest('hex');

export default class Transaction {
  constructor(value) {
    this.value = value;
    this.hash = createHash(this.value);
  }
}
