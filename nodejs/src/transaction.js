import crypto from 'crypto';

const DEFAULT_HASH_ALG = 'sha256';

// Hashes data and returns a hex string
export const createHash = (data, alg = DEFAULT_HASH_ALG) => data && crypto.createHash(alg).update(data.toString()).digest('hex');

export default class Transaction {
  constructor(value) {
    this.value = value;
    this.hash = createHash(this.value);
  }
}
