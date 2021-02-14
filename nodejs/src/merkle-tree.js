import _ from 'lodash';
import Transaction from './transaction.js';

const createTree = (leaves) => {
  const transactions = _.map(leaves, (leaf) => new Transaction(leaf));
  const hashes = _.map(transactions, (node) => node.hash);

  const tree = [hashes, transactions];

  // while there are still node pairs to hash together
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

  verify(node) {
    let { hash } = new Transaction(node);

    const genesis = this.tree[this.tree.length - 1];
    let position = _.findIndex(genesis, (gen) => gen.hash === hash);

    // no matching hash found from genesis list
    if (position < 0) {
      return false;
    }

    // start at the bottom of the tree and work our way up
    for (let i = this.tree.length - 2; i > 0; i -= 1) {
      if (hash !== this.tree[i][position]) {
        return false;
      }

      // if the current position is even && it's the last item in the tree
      if (position % 2 === 0 && position === (this.tree[i].length - 1)) {
        // keep our hash the same since pointer simply moves up.
        // Ex: pos === 2, this.tree[i] === [h, h, h].
        //     our hash (index 2) in this case just moves up since there is no neighbor
        hash = this.tree[i][position];
        position = Math.floor(position / 2);

        // if our position is even (left)
      } else if (position % 2 === 0) {
        // grab our neighbor to the right.
        const neighbor = this.tree[i][position + 1];

        // recalc position
        position = Math.floor(position / 2);

        // generate the hash for our neighbor + current hash
        const transaction = new Transaction(hash + neighbor);

        hash = transaction.hash;

        // if our position is odd (right)
      } else {
        // grab the neighbor to the left
        const neighbor = this.tree[i][position - 1];
        position = Math.floor((position - 1) / 2);

        const transaction = new Transaction(neighbor + hash);

        hash = transaction.hash;
      }
    }

    const [topNode] = this.tree[0];

    // once climbing finishes, compare our final hash with parent node hash
    return hash === topNode;
  }
}

export default MerkleTree;
