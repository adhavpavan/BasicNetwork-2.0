var log4js = require('log4js');
var logger = log4js.getLogger('Invoke-Offline');
logger.setLevel('DEBUG');

var crypto = require('crypto')
var hfc = require('fabric-client')
const fs = require('fs');
const path = require('path');

const hash = require('fabric-client/lib/hash');
const jsrsa = require('jsrsasign');
const { KEYUTIL } = jsrsa;
const elliptic = require('elliptic');
const EC = elliptic.ec;



// this ordersForCurve comes from CryptoSuite_ECDSA_AES.js and will be part of the
// stand alone fabric-sig package in future.
const ordersForCurve = {
    'secp256r1': {
        'halfOrder': elliptic.curves.p256.n.shrn(1),
        'order': elliptic.curves.p256.n
    },
    'secp384r1': {
        'halfOrder': elliptic.curves.p384.n.shrn(1),
        'order': elliptic.curves.p384.n
    }
};


// this function comes from CryptoSuite_ECDSA_AES.js and will be part of the
// stand alone fabric-sig package in future.
function _preventMalleability(sig, curveParams) {
    const halfOrder = ordersForCurve[curveParams.name].halfOrder;
    if (!halfOrder) {
        throw new Error('Can not find the half order needed to calculate "s" value for immalleable signatures. Unsupported curve name: ' + curveParams.name);
    }

    // in order to guarantee 's' falls in the lower range of the order, as explained in the above link,
    // first see if 's' is larger than half of the order, if so, it needs to be specially treated
    if (sig.s.cmp(halfOrder) === 1) { // module 'bn.js', file lib/bn.js, method cmp()
        // convert from BigInteger used by jsrsasign Key objects and bn.js used by elliptic Signature objects
        const bigNum = ordersForCurve[curveParams.name].order;
        sig.s = bigNum.sub(sig.s);
    }

    return sig;
}



/**
 * this method is used for test at this moment. In future this
 * would be a stand alone package that running at the browser/cellphone/PAD
 *
 * @param {string} privateKey PEM encoded private key
 * @param {Buffer} proposalBytes proposal bytes
 */
function sign(privateKey, proposalBytes, algorithm, keySize) {
    const hashAlgorithm = algorithm.toUpperCase();
    const hashFunction = hash[`${hashAlgorithm}_${keySize}`];
    const ecdsaCurve = elliptic.curves[`p${keySize}`];
    const ecdsa = new EC(ecdsaCurve);
    const key = KEYUTIL.getKey(privateKey);

    const signKey = ecdsa.keyFromPrivate(key.prvKeyHex, 'hex');
    const digest = hashFunction(proposalBytes);

    let sig = ecdsa.sign(Buffer.from(digest, 'hex'), signKey);
    sig = _preventMalleability(sig, key.ecparams);

    return Buffer.from(sig.toDER());
}


function signProposal(privateKeyPem, proposalBytes) {
    const signature = sign(privateKeyPem, proposalBytes, 'sha2', 256);
    const signedProposal = { signature, proposal_bytes: proposalBytes };
    return signedProposal;
}



var invokeChaincode = async function (peerNames, channelName, chaincodeName, fcn, args, username, org_name) {
    logger.debug("===========================================CHECKPOINT1=========================================")
    let config = '-connection-profile-path';
    let client = hfc.loadFromConfig(hfc.getConfigSetting('network' + config));
    client.loadFromConfig(hfc.getConfigSetting('Org1' + config));
    // client.loadFromConfig(hfc.getConfigSetting('Org2' + config));
    client.initCredentialStores();
    var channel = client.getChannel("mychannel");

    // var peers = channel.getPeersForOrg()
    // var peers = [];

    // var peers_org1 = channel.getPeersForOrg('Org1MSP')
    // var peers_org2 = channel.getPeersForOrg('Org2MSP')

    // peers = peers.concat(peers_org1, peers_org2)

    // var targets = peers.map(peer => peer.getPeer())

    const peer = channel.getPeer('peer0.org1.example.com');
    const targets = [peer];

    logger.debug("Logging target Peers without OrgId", targets)


    var transactionProposal = {
        fcn: 'move',
        args: ['a', 'b', '100'],
        chaincodeId: 'mycc',
        channelId: 'mychannel',
    };


    //===============================KEYS===================================//


    // //////////////////////////////////////////////////////////////////////////
    // ////////////////////////////Admin@org1.example.com////////////////////////
    // //////////////////////////////////////////////////////////////////////////

    var certPath = path.resolve(__dirname, "../artifacts/channel/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/Admin@org1.example.com-cert.pem")
    var certPem = fs.readFileSync(certPath, 'utf8');

    var privateKeyPath = path.resolve(__dirname, "../artifacts/channel/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/5890f0061619c06fb29dea8cb304edecc020fe63f41a6db109f1e227cc1cb2a8_sk")
    var privateKeyPem = fs.readFileSync(privateKeyPath, 'utf8');



    //////////////////////////////////////////////////////////////////////////
    ////////////////////////////user3@org1.example.com/////////////////////////
    //////////////////////////////////////////////////////////////////////////

    // var certPath = "/home/sundar/.fabric-ca-client/msp/signcerts/cert.pem"
    // var certPem = fs.readFileSync(certPath, 'utf8');

    // var privateKeyPath = "/home/sundar/.fabric-ca-client/msp/keystore/ec8c87a6d9e511c482c6abac9bf4d9919f85eb469bbcc8db0da1137b61bdacde_sk.pem"
    // var privateKeyPem = fs.readFileSync(privateKeyPath, 'utf8');



    //===============================KEYS===================================//



    var mspId = 'Org1MSP';
    // var mspId = 'Org2MSP';

    var { proposal, txId } = channel.generateUnsignedProposal(transactionProposal, mspId, certPem);

    logger.debug("Logging proposal", proposal)
    logger.debug("Logging transactionId", txId)


    var proposalBytes = proposal.toBuffer()

    // var digest = crypto.createHash('sha256').update(proposalBytes).digest('base64');	// calculate the hash of the proposal bytes

    // var elliptic = require('elliptic');
    // var { KEYUTIL } = require('jsrsasign');


    // // var { prvKeyHex } = KEYUTIL.getKey(privateKeyPem); // convert the pem encoded key to hex encoded private key
    // var key = KEYUTIL.getKey(privateKeyPem);

    // var EC = elliptic.ec;
    // var ecdsaCurve = elliptic.curves['p256'];

    // var ecdsa = new EC(ecdsaCurve);
    // var signKey = ecdsa.keyFromPrivate(key.prvKeyHex, 'hex');
    // var sig = ecdsa.sign(Buffer.from(digest, 'hex'), signKey);


    // sig = _preventMalleability(sig, key.ecparams);

    // var signature = Buffer.from(sig.toDER());


    // var signedProposal = {
    //     signature,
    //     proposal_bytes: proposalBytes,
    // };

    var signedProposal = signProposal(privateKeyPem, proposalBytes)

    var sendSignedProposalReq = { signedProposal, targets };
    logger.debug("Logging SignedProposalReq", sendSignedProposalReq)

    var proposalResponses = await channel.sendSignedProposal(sendSignedProposalReq);

    logger.debug("Logging proposalResponses", proposalResponses)




    // generate unsigned transaction

    const commitReq = {
        proposalResponses,
        proposal,
    };

    const commitProposal = await channel.generateUnsignedTransaction(commitReq);

    logger.debug("logging commit proposal", commitProposal)

    var commitProposalBytes = commitProposal.toBuffer()

    // sign transaction with user's private key

    const signedCommitProposal = signProposal(privateKeyPem, commitProposalBytes);

    logger.debug("Logging signed Commit Proposal", signedCommitProposal)

    // commit the signed transaction

    const response = await channel.sendSignedTransaction({
        signedProposal: signedCommitProposal,
        request: commitReq,
    });

    logger.debug("Logging commit response", response)


    // generate an unsigned eventhub registration for the ChannelEventHub.

    event_hubs = channel.getChannelEventHubsForOrg();
    event_hubs.forEach((eh) => {
        logger.debug("Generating an unsigned eventhub registration for the ChannelEventHub.")
        var unsignedEvent = eh.generateUnsignedRegistration({
            certificate: certPem,
            mspId,
        });

        logger.debug("Signing the unsigned eventhub registration with the user's private key")

        var signedProposal = signProposal(privateKeyPem, unsignedEvent);

        var signedEvent = {
            signature: signedProposal.signature,
            payload: signedProposal.proposal_bytes,
        };

        logger.debug("logging signedEvent", signedEvent)

        logger.debug("Establishing a connection with the fabric peer service")

        eh.connect({ signedEvent });

        logger.debug("The channelEventHub is registered with %s", eh.getPeerAddr())
    })

}


exports.invokeChaincode = invokeChaincode;

