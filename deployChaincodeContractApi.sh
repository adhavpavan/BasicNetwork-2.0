export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/assetauth.vn/orderers/orderer.assetauth.vn/msp/tlscacerts/tlsca.assetauth.vn-cert.pem
export PEER0_ORG1_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/firm.assetauth.vn/peers/peer0.firm.assetauth.vn/tls/ca.crt
export PEER0_ORG2_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/gov.assetauth.vn/peers/peer0.gov.assetauth.vn/tls/ca.crt
export FABRIC_CFG_PATH=${PWD}/artifacts/channel/config/

export CHANNEL_NAME=mychannel

setGlobalsForOrderer(){
    export CORE_PEER_LOCALMSPID="OrdererMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/assetauth.vn/orderers/orderer.assetauth.vn/msp/tlscacerts/tlsca.assetauth.vn-cert.pem
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/assetauth.vn/users/Admin@assetauth.vn/msp
    
}

setGlobalsForPeer0Org1(){
    export CORE_PEER_LOCALMSPID="FirmMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG1_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/firm.assetauth.vn/users/Admin@firm.assetauth.vn/msp
    export CORE_PEER_ADDRESS=localhost:7051
}

setGlobalsForPeer1Org1(){
    export CORE_PEER_LOCALMSPID="FirmMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG1_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/firm.assetauth.vn/users/Admin@firm.assetauth.vn/msp
    export CORE_PEER_ADDRESS=localhost:8051
    
}

setGlobalsForPeer0Org2(){
    export CORE_PEER_LOCALMSPID="GovMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG2_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/gov.assetauth.vn/users/Admin@gov.assetauth.vn/msp
    export CORE_PEER_ADDRESS=localhost:9051
    
}

setGlobalsForPeer1Org2(){
    export CORE_PEER_LOCALMSPID="GovMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG2_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/gov.assetauth.vn/users/Admin@gov.assetauth.vn/msp
    export CORE_PEER_ADDRESS=localhost:10051
    
}

presetup(){
    echo Vendoring Go dependencies ...
    pushd ./artifacts/src/github.com/asset_contract_api/go
    GO111MODULE=on go mod vendor
    popd
    echo Finished vendoring Go dependencies
}
presetup

CHANNEL_NAME="mychannel"
CC_RUNTIME_LANGUAGE="golang"
VERSION="1"
CC_SRC_PATH="./artifacts/src/github.com/asset_contract_api/go/"
CC_NAME="asset"

packageChaincode(){
    rm -rf ${CC_NAME}.tar.gz
    setGlobalsForPeer0Org1
    peer lifecycle chaincode package ${CC_NAME}.tar.gz --path ${CC_SRC_PATH} --lang ${CC_RUNTIME_LANGUAGE} --label ${CC_NAME}_${VERSION}
    echo "===================== Chaincode is packaged on peer0.org1 ===================== "
}

installChaincode(){
    setGlobalsForPeer0Org1
    peer lifecycle chaincode install ${CC_NAME}.tar.gz
    echo "===================== Chaincode is installed on peer0.org1 ===================== "
    
    setGlobalsForPeer1Org1
    peer lifecycle chaincode install ${CC_NAME}.tar.gz
    echo "===================== Chaincode is installed on peer1.org1 ===================== "
    
    setGlobalsForPeer0Org2
    peer lifecycle chaincode install ${CC_NAME}.tar.gz
    echo "===================== Chaincode is installed on peer0.org2 ===================== "
    
    setGlobalsForPeer1Org2
    peer lifecycle chaincode install ${CC_NAME}.tar.gz
    echo "===================== Chaincode is installed on peer1.org2 ===================== "
}

queryInstalled(){
    setGlobalsForPeer0Org1
    peer lifecycle chaincode queryinstalled >&log.txt
    cat log.txt
    PACKAGE_ID=$(sed -n "/${CC_NAME}_${VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
    echo PackageID is ${PACKAGE_ID}
    echo "===================== Query installed successful on peer0.org1 on channel ===================== "
}

approveForMyOrg1(){
    setGlobalsForPeer0Org1

    peer lifecycle chaincode approveformyorg -o localhost:7050  \
    --ordererTLSHostnameOverride orderer.assetauth.vn \
    --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
    --channelID $CHANNEL_NAME --name ${CC_NAME} \
    --version ${VERSION} --init-required --package-id ${PACKAGE_ID} --sequence ${VERSION}

    echo "===================== chaincode approved from org 1 ===================== "
    
}

# --signature-policy "OR ('FirmMSP.member')"
# --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA
# --peerAddresses peer0.firm.assetauth.vn:7051 --tlsRootCertFiles $PEER0_ORG1_CA --peerAddresses peer0.gov.assetauth.vn:9051 --tlsRootCertFiles $PEER0_ORG2_CA
#--channel-config-policy Channel/Application/Admins
# --signature-policy "OR ('FirmMSP.peer','GovMSP.peer')"


checkCommitReadyness(){
    setGlobalsForPeer0Org1

    peer lifecycle chaincode checkcommitreadiness --channelID $CHANNEL_NAME \
    --name ${CC_NAME} --version ${VERSION} --sequence ${VERSION} --output json --init-required

    echo "===================== checking commit readyness from org 1 ===================== "
}

approveForMyOrg2(){
    setGlobalsForPeer0Org2

    peer lifecycle chaincode approveformyorg -o localhost:7050 \
    --ordererTLSHostnameOverride orderer.assetauth.vn \
    --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
    --channelID $CHANNEL_NAME --name ${CC_NAME} \
    --version ${VERSION} --init-required \
    --package-id ${PACKAGE_ID} --sequence ${VERSION}

    echo "===================== chaincode approved from org 2 ===================== "
}

checkCommitReadyness(){
    
    setGlobalsForPeer0Org1

    peer lifecycle chaincode checkcommitreadiness --channelID $CHANNEL_NAME \
    --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA \
    --name ${CC_NAME} --version ${VERSION} \
    --sequence ${VERSION} --output json --init-required

    echo "===================== checking commit readyness from org 1 ===================== "
}

commitChaincodeDefination(){
    setGlobalsForPeer0Org1

    peer lifecycle chaincode commit -o localhost:7050 \
    --ordererTLSHostnameOverride orderer.assetauth.vn \
    --tls $CORE_PEER_TLS_ENABLED  --cafile $ORDERER_CA \
    --channelID $CHANNEL_NAME --name ${CC_NAME} \
    --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA \
    --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA \
    --version ${VERSION} --sequence ${VERSION} \
    --init-required
   
   echo "===================== Chaincode Defination commited on peer0-org 1 and peer0-org2 ===================== "
}

queryCommitted(){
    setGlobalsForPeer0Org1

    peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME --name ${CC_NAME}

    
}

chaincodeInvokeInit(){
    setGlobalsForPeer0Org1

    peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.assetauth.vn \
    --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA -C $CHANNEL_NAME -n ${CC_NAME} \
    --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA \
    --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA \
    --isInit -c '{"function":"initLedger","Args":[]}'
    
}


chaincodeInvoke(){
    # setGlobalsForPeer0Org1

    # Initialize Ledger
    # peer chaincode invoke -o localhost:7050 \
    # --ordererTLSHostnameOverride orderer.assetauth.vn \
    # --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA -C $CHANNEL_NAME -n ${CC_NAME} \
    # --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA \
    # --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA  \
    # -c '{"function":"initLedger","Args":[]}'
    
    setGlobalsForPeer0Org1

    ## Create Car
    peer chaincode invoke -o localhost:7050 \
        --ordererTLSHostnameOverride orderer.assetauth.vn \
        --tls $CORE_PEER_TLS_ENABLED \
        --cafile $ORDERER_CA \
        -C $CHANNEL_NAME -n ${CC_NAME}  \
        --peerAddresses localhost:7051 \
        --tlsRootCertFiles $PEER0_ORG1_CA \
        --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA $PEER_CONN_PARMS  \
        -c '{"function": "CreateAsset","Args":["ASSET3", "Than", "xe hoi", "hha", "111", "DQTT"]}'
    
    ## Change car owner
    # peer chaincode invoke -o localhost:7050 \
    #     --ordererTLSHostnameOverride orderer.assetauth.vn \
    #     --tls $CORE_PEER_TLS_ENABLED \
    #     --cafile $ORDERER_CA \
    #     -C $CHANNEL_NAME -n ${CC_NAME}  \
    #     --peerAddresses localhost:7051 \
    #     --tlsRootCertFiles $PEER0_ORG1_CA \
    #     --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA $PEER_CONN_PARMS  \
    #     -c '{"function": "ChangeCarOwner","Args":["Car-ABCDEEE", "Sandip"]}'
}

chaincodeQuery(){
    setGlobalsForPeer0Org1

    # Query all Cars
    peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"Args":["queryAllAsset"]}'

    # Query by Car id
    peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"Args":["queryAsset", "ASSET0"]}'
}

packageChaincode
installChaincode
queryInstalled
# sleep 2
approveForMyOrg1
# checkCommitReadyness
approveForMyOrg2
sleep 2
checkCommitReadyness
commitChaincodeDefination
sleep 2
queryCommitted
sleep 2
chaincodeInvokeInit
sleep 2
chaincodeInvoke
# chaincodeQuery