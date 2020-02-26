export CC_NAME=test_cc
export CC_PATH=github.com/test_cc
export NEW_CC_VERSION=1.2.0
echo "========== Install New Chaincode Using CLI on Peer0 Org1 =========="

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "export CORE_PEER_ADDRESS=peer0.org1.example.com:7051" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode install -n $CC_NAME -v $NEW_CC_VERSION -p $CC_PATH

echo "========== Install New Chaincode Using CLI on Peer1 Org1 =========="

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_ADDRESS=peer1.org1.example.com:7051" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode install -n $CC_NAME -v $NEW_CC_VERSION -p $CC_PATH

echo "========== Install New Chaincode Using CLI on Peer0 Org2 =========="

docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_ADDRESS=peer0.org2.example.com:7051" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp" cli peer chaincode install -n $CC_NAME -v $NEW_CC_VERSION -p $CC_PATH

echo "========== Install New Chaincode Using CLI on Peer1 Org2 =========="

docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_ADDRESS=peer1.org2.example.com:7051" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp" cli peer chaincode install -n $CC_NAME -v $NEW_CC_VERSION -p $CC_PATH


echo "========== Upgrade Chaincode =========="
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode upgrade -o orderer.example.com:7050 -C mychannel -n $CC_NAME -v $NEW_CC_VERSION -c '{"Args":[""]}' -P "OR ('Org1MSP.member','Org2MSP.member')"

echo "========== Finished Upgrading Chaincode =========="
