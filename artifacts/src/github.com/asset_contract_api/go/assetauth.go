package main

import (
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type SmartContract struct {
	contractapi.Contract
}

type Asset struct {
	Manufacturer   string `json:"manufacturer"`
	Name           string `json:"name"`
	SerialNumber   string `json:"serialnumber"`
	OwnerID        string `json:"ownerid"`
	OwnerName      string `json:"ownername"`
	RegisterDate   string `json:"registerdate"`
	LastUpdateDate string `json:"lastupdatedate"`
	IsDelete       bool   `json:"isdelete"`
}

type QueryResult struct {
	Key    string `json:"Key"`
	Record *Asset
}

func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	assets := []Asset{
		Asset{Manufacturer: "Toyota", Name: "Toyota Prius", SerialNumber: "TE_0000", OwnerID: "00", OwnerName: "Tien", RegisterDate: "2022-01-02", LastUpdateDate: "2022-03-06", IsDelete: false},
		Asset{Manufacturer: "Toyota", Name: "Toyota Madza", SerialNumber: "TE_1000", OwnerID: "01", OwnerName: "Thang", RegisterDate: "2022-01-02", LastUpdateDate: "2022-03-06", IsDelete: false},
	}

	for i, asset := range assets {
		assetAsBytes, _ := json.Marshal(asset)
		err := ctx.GetStub().PutState("ASSET"+strconv.Itoa(i), assetAsBytes)

		if err != nil {
			return fmt.Errorf("Failed to put to world state. %s", err.Error())
		}
	}

	return nil
}

func (s *SmartContract) CreateAsset(ctx contractapi.TransactionContextInterface, assetNumber string, manufacturer string, name string, serialNumber string, ownerID string, ownerName string) error {

	asset := Asset{
		Manufacturer: manufacturer,
		Name:         name,
		SerialNumber: serialNumber,
		OwnerID:      ownerID,
		OwnerName:    ownerName,
	}

	txntmsp, errN := ctx.GetStub().GetTxTimestamp()
	_ = errN
	time1 := time.Unix(txntmsp.Seconds, int64(txntmsp.Nanos)).String()

	asset.LastUpdateDate = time1

	asset.RegisterDate = time1

	asset.IsDelete = false

	assetAsBytes, _ := json.Marshal(asset)

	return ctx.GetStub().PutState(assetNumber, assetAsBytes)
}

func (s *SmartContract) QueryAsset(ctx contractapi.TransactionContextInterface, assetNumber string) (*Asset, error) {
	assetAsBytes, err := ctx.GetStub().GetState(assetNumber)

	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if assetAsBytes == nil {
		return nil, fmt.Errorf("%s does not exist", assetNumber)
	}

	asset := new(Asset)
	_ = json.Unmarshal(assetAsBytes, asset)

	return asset, nil
}

func (s *SmartContract) DeleteAsset(ctx contractapi.TransactionContextInterface, assetNumber string) error {
	asset, err := s.QueryAsset(ctx, assetNumber)

	if err != nil {
		return err
	}

	if asset.IsDelete == true {
		return fmt.Errorf("The designated asset has been deleted since %s", asset.LastUpdateDate)
	}

	txntmsp, errN := ctx.GetStub().GetTxTimestamp()
	_ = errN
	time1 := time.Unix(txntmsp.Seconds, int64(txntmsp.Nanos)).String()

	asset.IsDelete = true

	asset.LastUpdateDate = time1

	assetAsBytes, _ := json.Marshal(asset)

	return ctx.GetStub().PutState(assetNumber, assetAsBytes)
}

func (s *SmartContract) ChangeAssetOwner(ctx contractapi.TransactionContextInterface, assetNumber string, newOwnerId string, newOwnerName string) error {
	asset, err := s.QueryAsset(ctx, assetNumber)

	if err != nil {
		return err
	}

	if asset.IsDelete == true {
		return fmt.Errorf("The designated asset has been deleted since %s", asset.LastUpdateDate)
	}

	txntmsp, errN := ctx.GetStub().GetTxTimestamp()
	_ = errN
	time1 := time.Unix(txntmsp.Seconds, int64(txntmsp.Nanos)).String()

	asset.OwnerID = newOwnerId

	asset.OwnerName = newOwnerName

	asset.LastUpdateDate = time1

	assetAsBytes, _ := json.Marshal(asset)

	return ctx.GetStub().PutState(assetNumber, assetAsBytes)
}

func (s *SmartContract) QueryAllAsset(ctx contractapi.TransactionContextInterface) ([]QueryResult, error) {
	startKey := ""
	endKey := ""

	resultsIterator, err := ctx.GetStub().GetStateByRange(startKey, endKey)

	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	results := []QueryResult{}

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()

		if err != nil {
			return nil, err
		}

		asset := new(Asset)
		_ = json.Unmarshal(queryResponse.Value, asset)

		queryResult := QueryResult{Key: queryResponse.Key, Record: asset}
		results = append(results, queryResult)
	}

	return results, nil
}

func main() {

	chaincode, err := contractapi.NewChaincode(new(SmartContract))

	if err != nil {
		fmt.Printf("Error create asset chaincode: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting asset chaincode: %s", err.Error())
	}
}
