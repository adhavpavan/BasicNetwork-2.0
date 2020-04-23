// import { Gateway, Wallets, GatewayOptions, DefaultEventHandlerStrategies, TxEventHandlerFactory, TxEventHandler } from 'fabric-network'


const { Gateway, Wallets, GatewayOptions, DefaultEventHandlerStrategies, TxEventHandlerFactory, TxEventHandler } = require('fabric-network');
const fs = require('fs');
const path = require("path")
const log4js = require('log4js');
const logger = log4js.getLogger('BasicNetwork');
const util = require('util')


const helper = require('./helper')

// console.log(TxEventHandler)

const invokeTransaction = async (channelName, chaincodeName, fcn, args, username, org_name) => {
    try {
        logger.debug(util.format('\n============ invoke transaction on channel %s ============\n', channelName));
        var error_message = null;

        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', 'config', 'connection-org1.json');
        const ccpJSON = fs.readFileSync(ccpPath, 'utf8')
        const ccp = JSON.parse(ccpJSON);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(username);
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet, so registering user`);
            await helper.getRegisteredUser(username, org_name, true)
            identity = await wallet.get(username);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        const connectOptions = {
            transaction: {
                strategy: DefaultEventHandlerStrategies.NETWORK_SCOPE_ANYFORTX
            }
        }


        console.log(`Checking----------------------------------------------------`)
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet, identity: username, discovery: { enabled: true, asLocalhost: true }, transaction: {
                strategy: DefaultEventHandlerStrategies.MSPID_SCOPE_ANYFORTX
                // strategy: createTransactionEventHandler
            }
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(channelName);

        // Get the contract from the network.
        const contract = network.getContract(chaincodeName);

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
        // await contract.submitTransaction('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom');
        let result = await contract.submitTransaction(fcn, args[0], args[1], args[2], args[3], args[4]);
        console.log('Transaction has been submitted');
        if (result != null) {
            // console.log(decoder.write(result))
            console.log(`${JSON.stringify(result)}`)
            // console.log(`not null: ${Buffer.byteLength(result)}`)
            // Buffer.from(JSON.parse(JSON.stringify(Buffer.from(result.data)))).toString()
            // console.log(`result is : ${result}`)

        } else {
            console.log(`result is null`)
        }

        // Disconnect from the gateway.
        await gateway.disconnect();

        return result


    } catch (error) {

        console.log(`Getting error: ${error}`)

    }
}

const createTransactionEventHandler = (transactionId, network) => {
    const mspId = network.getGateway().getIdentity().mspId;
    const myOrgPeers = network.getChannel().getEndorsers(mspId);
    console.log(`tx id : ${transactionId}`)

    // return new MyTransactionEventHandler(transactionId, network, myOrgPeers);
}

// class MyTransactionEventHandler extends TxEventHandler {
//     /**
//      * Called to initiate listening for transaction events.
//      */
//     async startListening() { /* Your implementation here */ }

//     /**
//      * Wait until enough events have been received from peers to satisfy the event handling strategy.
//      * @throws {Error} if the transaction commit is not successfully confirmed.
//      */
//     async waitForEvents() { /* Your implementation here */ }

//     /**
//      * Cancel listening for events.
//      */
//     cancelListening() { /* Your implementation here */ }
// }

exports.invokeTransaction = invokeTransaction;