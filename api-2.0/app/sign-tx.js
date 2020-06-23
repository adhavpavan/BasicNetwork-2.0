

//    =============How to sign a transaction by an identity's private key============

// Step : 1 generate an unsigned transaction proposal with the identity's certificate

const certPem = '<PEM encoded certificate content>';
const mspId = 'Org1MSP'; // the msp Id for this org

const transactionProposal = {
    fcn: 'move',
    args: ['a', 'b', '100'],
    chaincodeId: 'mychaincodeId',
    channelId: 'mychannel',
};
const { proposal, txId } = channel.generateUnsignedProposal(transactionProposal, mspId, certPem);



//  Step 2 : calculate the hash of the transaction proposal bytes.

const proposalBytes = proposal.toBuffer(); // the proposal comes from step 1

const hashFunction = xxxx; // A hash function by the user's desire

const digest = hashFunction(proposalBytes); // calculate the hash of the proposal bytes


//  Step 3 : calculate the signature for this transaction proposal

const elliptic = require('elliptic');
const { KEYUTIL } = require('jsrsasign');

const privateKeyPEM = '<The PEM encoded private key>';
const { prvKeyHex } = KEYUTIL.getKey(privateKeyPEM); // convert the pem encoded key to hex encoded private key

const EC = elliptic.ec;
const ecdsaCurve = elliptic.curves['p256'];

const ecdsa = new EC(ecdsaCurve);
const signKey = ecdsa.keyFromPrivate(prvKeyHex, 'hex');
const sig = ecdsa.sign(Buffer.from(digest, 'hex'), signKey);

// now we have the signature, next we should send the signed transaction proposal to the peer
const signature = Buffer.from(sig.toDER());
const signedProposal = {
    signature,
    proposal_bytes: proposalBytes,
};


// Step 4 : send the signed transaction proposal to peer(s)

const sendSignedProposalReq = { signedProposal, targets };
const proposalResponses = await channel.sendSignedProposal(sendSignedProposalReq);