package main

import (
	"fmt"
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

	// loop through current branch in tree
	for len(t.tree[0]) > 1 {
		nodes := []string{}

		for i := 0; i < len(t.tree[0]); i += 2 {
			// even # of hashes
			if (i % 2 == 0 && i < len(t.tree[0]) - 1) {
				var sb strings.Builder

				sb.WriteString(t.tree[0][i])
				sb.WriteString(t.tree[0][i + 1])

				nt := newTransaction(sb.String())

				nodes = append(nodes, nt.hash)
			} else {
				// if odd # of hashes, repeat last hash # in tree
				nodes = append(nodes, t.tree[0][i])
			}
		}

		t.tree = append([][]string{nodes}, t.tree...)
	}
}

func newTree(l []string) *MerkleTree {
	merkle := MerkleTree{}
	merkle.build(l)

	return &merkle
}

func main() {
	leaves := []string{"a", "b", "c", "d"}

	merkle := newTree(leaves)

	fmt.Println("FINAL HASHES", merkle.tree)
}
