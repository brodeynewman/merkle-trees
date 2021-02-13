import MerkleTree from './merkle-tree.js';

const tree = new MerkleTree(['a', 'b', 'c', 'd']);

// console.log('DONE', tree);

console.log('Verified?', tree.isVerified('c'));
