import { createHash } from './utils.js';

export default class Transaction {
  constructor(value) {
    this.value = value;
    this.hash = createHash(this.value);
  }
}
