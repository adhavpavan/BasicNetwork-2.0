export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
export PEER0_ORG1_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export PEER0_ORG2_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
export FABRIC_CFG_PATH=${PWD}/artifacts/channel/config/

export CHANNEL_NAME=mychannel

setGlobalsForOrderer() {
    export CORE_PEER_LOCALMSPID="OrdererMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/example.com/users/Admin@example.com/msp

}

setGlobalsForPeer0Org1() {
    export CORE_PEER_LOCALMSPID="Org1MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG1_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
    export CORE_PEER_ADDRESS=localhost:7051
}

setGlobalsForPeer1Org1() {
    export CORE_PEER_LOCALMSPID="Org1MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG1_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
    export CORE_PEER_ADDRESS=localhost:8051

}

setGlobalsForPeer0Org2() {
    export CORE_PEER_LOCALMSPID="Org2MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG2_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
    export CORE_PEER_ADDRESS=localhost:9051

}

setGlobalsForPeer1Org2() {
    export CORE_PEER_LOCALMSPID="Org2MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG2_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
    export CORE_PEER_ADDRESS=localhost:10051

}


invokeFunctions() {
    # Get Transaction By tx id
    setGlobalsForPeer0Org1
    peer chaincode invoke \
        -o localhost:7050 \
        --cafile $ORDERER_CA \
        --tls $CORE_PEER_TLS_ENABLED \
        --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA \
        -C mychannel -n qscc \
        -c '{"function":"GetTransactionByID","Args":["mychannel", "eb00ec055803ca538fc32637e622caa62687c30e07c84d7002ad4e73a13e71b1"]}'

    # peer chaincode invoke \
    #     -o localhost:7050 \
    #     --cafile $ORDERER_CA \
    #     --tls $CORE_PEER_TLS_ENABLED \
    #     --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA \
    #     -C mychannel -n qscc \
    #     -c '{"function":"GetChainInfo","Args":["mychannel"]}'

    # peer chaincode invoke \
    #     -o localhost:7050 \
    #     --cafile $ORDERER_CA \
    #     --tls $CORE_PEER_TLS_ENABLED \
    #     --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA \
    #     -C mychannel -n qscc \
    #     -c '{"function":"GetBlockByNumber","Args":["mychannel","2"]}'

}
invokeFunctions