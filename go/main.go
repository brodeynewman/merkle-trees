package main

import (
	"fmt"
	"math"
	"strings"
	"crypto/sha256"
	"encoding/hex"
)

type Transaction struct {
	value string
	hash string
}

func (t *Transaction) getHash() {
	h := sha256.New()
	h.Write([]byte(t.value))
	hash := hex.EncodeToString(h.Sum(nil))

	t.hash = hash
}

func newTransaction(v string) Transaction {
	t := Transaction{}
	t.value = v
	t.getHash()

	return t
}

type MerkleTree struct {
	genesis []Transaction
	tree [][]string
}

func (t *MerkleTree) verify(l string) bool {
	var pos int = -1

	var hash string = newTransaction(l).hash

	for i := 0; i < len(t.genesis); i++ {
		// if hashes match, record position
		if (t.genesis[i].hash == hash) {
			pos = i
		}
	}

	// if position in genesis does not exist, exit with false
	if pos < 0 {
		return false;
	}

	// start at the bottom of our tree and work our way up
	for i := len(t.tree) - 1; i > 0; i-- {
		// if new position is at the end of the tree. Ex: pos = 2 and t.tree[i] = [h, h, h]
		if (pos % 2 == 0 && pos == len(t.tree[i]) - 1) {
			// keep same hash since there is no neighbor
			hash = t.tree[i][pos]

			// recalc position
			pos = int(math.Floor(float64(pos / 2)))
			
			// if position is 0, get neighbor to the right
		} else if (pos % 2 == 0) {
			n := t.tree[i][pos + 1]
			h := buildhashFromTransaction(hash, n)

			pos = int(math.Floor(float64(pos / 2)))

			hash = h

			// if position is odd, get neighbor to the left
		} else {
			n := t.tree[i][pos - 1]
			h := buildhashFromTransaction(n, hash)

			pos = int(math.Floor(float64((pos - 1)) / 2))
			hash = h
		}
	}

	// once climbing is done, compare final hash with root hash
	return hash == t.tree[0][0]
}

func (t *MerkleTree) build(l []string) {
	t.genesis = []Transaction{}

	// create genesis records from leaf nodes
	for _, v := range l {
		// create transactions for every leaf
		ts := newTransaction(v)

		// append it to merkle 'tree'
		t.genesis = append(t.genesis, ts)
	}

	h := []string{}

	// create hashes from genesis records
	for i := 0; i < len(t.genesis); i ++ {
		h = append(h, t.genesis[i].hash)
	}

	t.tree = append(t.tree, h)

	// loop through current branch in tree while tree[0] has nodes to hash together
	for len(t.tree[0]) > 1 {
		nodes := []string{}

		for i := 0; i < len(t.tree[0]); i += 2 {
			// even # of hashes
			if (i % 2 == 0 && i < len(t.tree[0]) - 1) {
				hash := buildhashFromTransaction(t.tree[0][i], t.tree[0][i + 1])

				nodes = append(nodes, hash)
			} else {
				// if odd # of hashes, repeat last hash # in tree
				nodes = append(nodes, t.tree[0][i])
			}
		}

		// prepend the tree with the newly created list of hashes
		t.tree = append([][]string{nodes}, t.tree...)
	}
}

func buildhashFromTransaction(a string, b string) string {
	var sb strings.Builder

	sb.WriteString(a)
	sb.WriteString(b)

	nt := newTransaction(sb.String())

	return nt.hash
}

func newTree(l []string) *MerkleTree {
	merkle := MerkleTree{}
	merkle.build(l)

	return &merkle
}

func main() {
	leaves := []string{"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"}

	merkle := newTree(leaves)

	fmt.Println(merkle.verify("e")) // true
	fmt.Println(merkle.verify("a")) // true
	fmt.Println(merkle.verify("z")) // false
	fmt.Println(merkle.verify("j")) // true
}
