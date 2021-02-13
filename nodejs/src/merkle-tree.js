import _ from 'lodash';
import Transaction from './transaction.js';

const createTree = (leaves) => {
  const transactions = _.map(leaves, (leaf) => new Transaction(leaf));
  const hashes = _.map(transactions, (node) => node.hash);

  const tree = [hashes, transactions];

  while (tree[0].length > 1) {
    const temp = [];

    // inc 2 due to merkle being binary
    for (let i = 0; i < tree[0].length; i += 2) {
      // we're on an even node
      if (i < tree[0].length - 1 && i % 2 === 0) {
        // hash left + right hashes together
        const transaction = new Transaction(tree[0][i] + tree[0][i + 1]);

        temp.push(transaction.hash);
      } else {
        temp.push(tree[0][i]);
      }
    }

    tree.unshift(temp);
  }

  return tree;
};

class MerkleTree {
  constructor(leaves) {
    this.root = createTree(leaves);
  }

  isVerified(node) {
    let { hash } = new Transaction(node);

    const genesis = this.root[this.root.length - 1];
    let position = _.findIndex(genesis, (gen) => gen.hash === hash);

    // no matching hash found from genesis list
    if (!position) {
      return false;
    }

    console.log('starting here', this.root, position, hash);

    for (let i = this.root.length - 2; i > 0; i -= 1) {
      console.log('curr', this.root[i]);

      if (hash !== this.root[i][position]) {
        console.log('BROKEN MOTHAFUCKA');

        return false;
      }

      let neighbor;

      if (position % 2 === 0) {
        // binary -- so we're getting very next child
        neighbor = this.root[i][i + 1];
        position = Math.floor(position / 2);

        // I want to let the transaction class handle all of the hashing
        const transaction = new Transaction(hash + neighbor);

        hash = transaction.hash;
      } else {
        // neighbor = 
      }
    }
  }
}

export default MerkleTree;
