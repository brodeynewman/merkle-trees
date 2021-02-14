import MerkleTree from './merkle-tree.js';

const tree = new MerkleTree(['a', 'b', 'c']);

console.log('Verified?', tree.verify('c')); // true
console.log('Verified?', tree.verify('A')); // false

console.log('Root: ', tree.root); // false

console.log('Proof: ', tree.getProof('d')); // false

console.log('TREE', tree.tree);
