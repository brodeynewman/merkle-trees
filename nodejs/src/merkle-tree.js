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
    this.tree = createTree(leaves);
  }

  get root() {
    return this.tree[0][0];
  }

  getProof(leaf) {
    const shouldGenerateProof = true;

    const [, proof] = this.verify(leaf, shouldGenerateProof);

    return proof;
  }

  verify(node, generateProof) {
    let { hash } = new Transaction(node);

    const genesis = this.tree[this.tree.length - 1];
    let position = _.findIndex(genesis, (gen) => gen.hash === hash);

    const proof = [];

    // no matching hash found from genesis list
    if (position < 0) {
      return false;
    }

    for (let i = this.tree.length - 2; i > 0; i -= 1) {
      if (hash !== this.tree[i][position]) {
        return false;
      }

      let neighbor;

      if (position % 2 === 0) {
        // binary -- so we're getting very next child
        neighbor = this.tree[i][position + 1];
        position = Math.floor(position / 2);

        // I want to let the transaction class handle all of the hashing
        const transaction = new Transaction(hash + neighbor);

        if (generateProof) {
          proof.push({
            data: hash,
            position: 'left',
          });
        }

        hash = transaction.hash;
      } else {
        neighbor = this.tree[i][position - 1];
        position = Math.floor((position - 1) / 2);

        const transaction = new Transaction(neighbor + hash);

        if (generateProof) {
          proof.push({
            data: hash,
            position: 'right',
          });
        }

        hash = transaction.hash;
      }
    }

    const [topNode] = this.tree[0];

    const isValid = hash === topNode;

    return generateProof ? [isValid, proof] : isValid;
  }
}

export default MerkleTree;
