#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    local PP1=$(one_line_pem $6)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        -e "s#\${PEERPEM1}#$PP1#" \
        -e "s#\${P0PORT1}#$7#" \
        ./ccp-template.json
}

ORG=firm
P0PORT=7051
CAPORT=7054
P0PORT1=8051
PEERPEM=../../artifacts/channel/crypto-config/peerOrganizations/firm.assetauth.vn/peers/peer0.firm.assetauth.vn/msp/tlscacerts/tlsca.firm.assetauth.vn-cert.pem
PEERPEM1=../../artifacts/channel/crypto-config/peerOrganizations/firm.assetauth.vn/peers/peer1.firm.assetauth.vn/msp/tlscacerts/tlsca.firm.assetauth.vn-cert.pem
CAPEM=../../artifacts/channel/crypto-config/peerOrganizations/firm.assetauth.vn/msp/tlscacerts/tlsca.firm.assetauth.vn-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $PEERPEM1 $P0PORT1)" > connection-$ORG.json


ORG=gov
P0PORT=9051
CAPORT=8054
P0PORT1=10051
PEERPEM=../../artifacts/channel/crypto-config/peerOrganizations/gov.assetauth.vn/peers/peer0.gov.assetauth.vn/msp/tlscacerts/tlsca.gov.assetauth.vn-cert.pem
PEERPEM1=../../artifacts/channel/crypto-config/peerOrganizations/gov.assetauth.vn/peers/peer1.gov.assetauth.vn/msp/tlscacerts/tlsca.gov.assetauth.vn-cert.pem
CAPEM=../../artifacts/channel/crypto-config/peerOrganizations/gov.assetauth.vn/msp/tlscacerts/tlsca.gov.assetauth.vn-cert.pem


echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $PEERPEM1 $P0PORT1)" > connection-$ORG.json