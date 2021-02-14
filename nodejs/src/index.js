import MerkleTree from './merkle-tree.js';

const tree = new MerkleTree(['a', 'b', 'c']);

console.log(tree.verify('c')); // true
console.log(tree.verify('A')); // false
