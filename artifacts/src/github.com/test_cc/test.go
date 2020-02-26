package main

import (
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

type SmartContract struct {
}

func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {
	function, args := APIstub.GetFunctionAndParameters()

	if function == "CreateSampleData" {
		return s.CreateSampleData(APIstub, args)
	} else if function == "GetSampleData" {
		return s.GetSampleData(APIstub, args)
	}

	return shim.Error("Invalid Smart Contract name")
}

func (s *SmartContract) CreateSampleData(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	// isAlreadyExist, err := APIstub.GetState(args[1])

	// if err != nil {
	// 	return shim.Error("Failed to get sample data: " + err.Error())
	// } else if isAlreadyExist != nil {
	// 	fmt.Println("This marble already exists: " + args[1])
	// 	return shim.Error("This sample data already exists: " + args[1])
	// }

	dataAsBytes := []byte(args[0])

	err := APIstub.PutState(args[1], dataAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	// err = APIstub.SetEvent(args[0])

	return shim.Success(nil)
}

func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}

func (s *SmartContract) GetSampleData(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	dataAsBytes, _ := APIstub.GetState(args[0])
	return shim.Success(dataAsBytes)
}
