import MerkleTree from './merkle-tree.js';

const tree = new MerkleTree(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k']);

console.log('Verified?', tree.verify('a')); // true
console.log('Verified?', tree.verify('A')); // false

console.log('Root: ', tree.root); // false

console.log('Proof: ', tree.getProof('d')); // false

console.log('TREE', tree.tree);
