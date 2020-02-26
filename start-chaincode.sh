echo "========== Stop Previous Docker Containers=========="

docker-compose -f artifacts/docker-compose.yaml down

# # Use REGEX to search and delete keystore folders starting with 'fabric-client-kv'
echo "========== Deleting Old KeyStore =========="
rm -rf `ls | grep -E "^fabric-client-kv*"`

echo "========== Start Containers=========="

 docker-compose -f artifacts/docker-compose.yaml up -d

export CHANNEL_NAME=mychannel
export CC_NAME=test_cc
export CC_PATH=github.com/test_cc
export CC_VERSION=2.0
export FABRIC_START_TIMEOUT=5
sleep ${FABRIC_START_TIMEOUT}


echo "========== Creating Channel=========="
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/channel/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer channel create -o orderer.example.com:7050 -c mychannel -f /etc/hyperledger/channel/channel.tx --tls --cafile /etc/hyperledger/channel/crypto-config/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem


echo "========== Join Channel: Peer0 Org1 =========="

# # Join peer0.org1.example.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/channel/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" -e "CORE_PEER_ADDRESS=peer0.org1.example.com:7051" cli peer channel join -b mychannel.block


# #  # Fetch genesis block for Peer1 Org1
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/channel/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" peer1.org1.example.com peer channel fetch newest mychannel.block -c mychannel --orderer orderer.example.com:7050 --tls --cafile /etc/hyperledger/channel/crypto-config/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem


# # # Join channel  peer 1
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/channel/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" peer1.org1.example.com peer channel join -b mychannel.block
# echo "========== Join Channel: Peer01 Org1 =========="

# #  # Fetch genesis block for Peer1 Org1
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/channel/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" peer2.org1.example.com peer channel fetch newest mychannel.block -c mychannel --orderer orderer.example.com:7050 --tls --cafile /etc/hyperledger/channel/crypto-config/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem


# # Join channel  peer 1
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/channel/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" peer2.org1.example.com peer channel join -b mychannel.block
# # echo "========== Join Channel: Peer2 Org1 =========="




echo "========== Install Chaincode Using CLI on Peer0 Org1 =========="
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "export CORE_PEER_ADDRESS=peer0.org1.example.com:7051" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/channel/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode install -n $CC_NAME -v $CC_VERSION -p $CC_PATH

echo "========== Install Chaincode Using CLI on Peer1 Org1 =========="
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_ADDRESS=peer1.org1.example.com:8051" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/channel/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode install -n $CC_NAME -v $CC_VERSION -p $CC_PATH

echo "========== Install Chaincode Using CLI on Peer2 Org1 =========="
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_ADDRESS=peer2.org1.example.com:9051" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/channel/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode install -n $CC_NAME -v $CC_VERSION -p $CC_PATH




echo "========== Instantiate Chaincode on peer0 =========="
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/channel/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n $CC_NAME -v $CC_VERSION -c '{"Args":[""]}' -P "OR ('Org1MSP.member')" --tls --cafile /etc/hyperledger/channel/crypto-config/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem


sleep 10

# echo "========== Finished Instantiating Chaincode =========="
