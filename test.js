// var process = require('child_process');

// let CORE_PEER_TLS_ENABLED= true
// let PEER0_ORG1_CA=`${__dirname}/artifacts/channel/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt`
// let ORDERER_CA=`${__dirname}/artifacts/channel/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem`

// // console.log(process.env.CORE_PEER_LOCALMSPID)

// process.exec(`peer chaincode invoke -o https://localhost:7050 \
// --cafile /home/pavan/Music/UdemyCourse/BasicNetwork_2.0/artifacts/channel/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
// --tls true --peerAddresses localhost:7051 \
// --tlsRootCertFiles /home/pavan/Music/UdemyCourse/BasicNetwork_2.0/artifacts/channel/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt \
// -C mychannel -n qscc \
// -c '{"function":"GetTransactionByID","Args":["mychannel", "ff8057a4ad679464f832b5d87adcf81f3af9d67af6adf4a25334788a9f5ca338"]}'`, function (err, stdout, stderr) {
//     if (err) {
//         console.log("\n" + stderr);
//     } else {
//         console.log(stdout);
//     }
// });



var exec = require('child_process').exec;



exec('./deployChaincode.sh', function (error, stdOut, stdErr) {
    // console.log(stdErr)
    if (error) {
        console.log("\n" + stderr);
    } else {
        console.log(JSON.parse(stdOut));
    }
});