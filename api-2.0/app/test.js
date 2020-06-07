var process = require('child_process');

console.log(`${__dirname}/../../artifacts/channel/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt`)

process.exec(`peer chaincode invoke --peerAddresses localhost:7051 --tlsRootCertFiles /home/pavan/Music/UdemyCourse/BasicNetwork_2.0/artifacts/channel/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt -C mychannel -n qscc -c '{ "function": "GetTransactionByID", "Args": ["mychannel", "ff8057a4ad679464f832b5d87adcf81f3af9d67af6adf4a25334788a9f5ca338"] }'`, function (err, stdout, stderr) {
    if (err) {
        console.log("\n" + stderr);
    } else {
        console.log(stdout);
    }
});