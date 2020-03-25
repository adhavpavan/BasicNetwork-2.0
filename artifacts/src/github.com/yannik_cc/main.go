package main

import (
	"crypto/ecdsa"
	"crypto/sha256"
	"encoding/json"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/core/chaincode/shim/ext/cid"
	"github.com/hyperledger/fabric/protos/peer"

	//"crypto/elliptic"
	"crypto/x509"
	"encoding/asn1"
	"encoding/hex"
	"io"
	"math/big"

	//"encoding/pem"
	"fmt"
)

/**
 * SmartContract
 */
type SmartContract struct {
}

// const logPath = "/example.log"

type Product struct {
	ID        string `json:"id"`
	Signature string `json:"signature"`
	Owner     string `json:"owner"`
}

/**
 * Init is called during chaincode instantiation to initialize any data
 */
func (sc *SmartContract) Init(stub shim.ChaincodeStubInterface) peer.Response {
	return shim.Success(nil)
}

/**
 * Invoke is called per transaction on the chaincode
 */
func (sc *SmartContract) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	fn, args := stub.GetFunctionAndParameters()

	if fn == "cryptoTransfer" {
		return sc.cryptoTransfer(stub, args)
	}
	return shim.Error("Invalid Smart Contract function name.")
}

func (sc *SmartContract) cryptoTransfer(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	// logger.Infof("Starting cryptoTransfer...")
	if len(args) != 3 {
		return shim.Error("Incorrect arguments. Expecting: signature | product | publicKey")
	}

	cert, err := cid.GetX509Certificate(stub)
	if err != nil {
		shim.Error(err.Error())
	}
	pubKey_caller := new(ecdsa.PublicKey)
	pubKey_caller = cert.PublicKey.(*ecdsa.PublicKey)
	genericPublicKey, _ := x509.MarshalPKIXPublicKey(pubKey_caller)

	// logger.Infof("Reading product from blockchain...")
	// shim.LogInfo("Reading product from blockchain...")
	dataBytes, _ := stub.GetState(args[1])
	if dataBytes == nil {
		product := Product{Owner: fmt.Sprintf("%x", genericPublicKey)}
		str, _ := json.Marshal(product)
		stub.PutState(args[1], []byte(str))
	} else {
		product := Product{}
		json.Unmarshal(dataBytes, &product)
		signature := args[0]
		message := args[1] + args[2]
		h := sha256.New()
		io.WriteString(h, message)
		signhash := h.Sum(nil)

		der, _ := hex.DecodeString(signature)

		sig := &ECDSASignature{}
		asn1.Unmarshal(der, sig)

		decoded, _ := hex.DecodeString(product.Owner)
		genericPublicKey, _ := x509.ParsePKIXPublicKey(decoded)
		pubKey_owner := genericPublicKey.(*ecdsa.PublicKey)

		verifystatus := ecdsa.Verify(pubKey_owner, signhash, sig.R, sig.S)

		if verifystatus == true {

			entry := Product{Signature: args[0], Owner: args[2]}
			str, _ := json.Marshal(entry)
			stub.PutState(args[1], []byte(str))
			return shim.Success(nil)
		} else {
			return shim.Error("Signature did not verify!")
		}

		return shim.Success(dataBytes)
	}

	return shim.Success(nil)
}

// represents the two mathematical components of an ECDSA signature once decomposed
type ECDSASignature struct {
	R, S *big.Int
}

/**
 * Main function
 */
func main() {
	sc := new(SmartContract)
	if err := shim.Start(sc); err != nil {
		shim.Error(err.Error())
	}
}
