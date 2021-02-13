package main

import (
	"fmt"
	// "crypto/sha256"
)

type Transaction struct {
	value string
	hash string
}

func (t *Transaction) getHash() {
	// t.hash = 
}

type MerkleTree struct {
	tree []Transaction
}

func (t *MerkleTree) verify(l string) {
	
}

func (t *MerkleTree) New(l []string) {
	transactions := []Transaction{}
	// t.tree = []Transaction{Transaction{1, "hello"}}

	for _, v := range l {
		t := new(Transaction)

		transaction := t.New(v)

		fmt.Println(transaction)

		// transactions = append(transactions, transaction)
	}

	t.tree = transactions;
}

func (t *Transaction) New(v string) *Transaction {
	transaction := Transaction{}

	// transaction.hash()

	return &transaction
}

func createTree(l []string) *MerkleTree {
	tree := new(MerkleTree)

	tree.New(l)

	return tree
}

func main() {
	leaves := []string{"a", "b", "c", "d"}

	tree := createTree(leaves)

	fmt.Println("FINAL", tree)
}
