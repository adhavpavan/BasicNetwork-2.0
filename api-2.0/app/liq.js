const { Gateway, Wallets, TxEventHandler, GatewayOptions, DefaultEventHandlerStrategies, TxEventHandlerFactory } = require('fabric-network');
const fs = require('fs');
const path = require("path")
const log4js = require('log4js');
const logger = log4js.getLogger('BasicNetwork');
const util = require('util')
const { v4: uuidv4 } = require('uuid');
const helper = require('./helper')



const invokeTransaction = async (channelName, chaincodeName, fcn, args, username, org_name, transientData) => {
    // try {
    logger.debug(util.format('\n============ invoke transaction on channel %s ============\n', channelName));

    const ccp = await helper.getCCP(org_name)

    const walletPath = await helper.getWalletPath(org_name)
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    let identity = await wallet.get(username);
    console.log(username)
    if (!identity) {
        console.log(`An identity for the user ${username} does not exist in the wallet, so registering user`);
        await helper.getRegisteredUser(username, org_name, true)
        identity = await wallet.get(username);
        console.log('Run the registerUser.js application before retrying');
        return;
    }

    const connectOptions = {
        wallet, identity: username, discovery: { enabled: true, asLocalhost: true },
        eventHandlerOptions: {
            commitTimeout: 100,
            strategy: DefaultEventHandlerStrategies.NETWORK_SCOPE_ALLFORTX
        },
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, connectOptions);

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);


    let product = {
        srNumber: '123',
        batchNumber: 'prd111',
        batchQuantity: '10',
        productId: '22',
        productTypeId: '123',
        name: '22',
        productTypeName: '123',
        brandName: '22',
        description: '123',
        size: '22',
        manufacturingDate: '123',
        imageUrl: '22',
        websiteUrl: '123'
    }

    let result = await contract.submitTransaction("createProduct", [JSON.stringify(product)]);
    console.log(`result is : ${result}`)
    message = `Successfully added product`

    let batches = parseInt(product.batchQuantity)
    console.log(`batch count is : ${batches}`)
    let batchArray = []
    while (batches > 0) {
        console.log(`inside while`)
        for (let count = 0; count < 100; count++) {
            console.log(`inside for loop`)
            if (batches == 0) {
                console.log(`inside  if`)
                break;
            }
            console.log(`Creating Batch number :${count}`)

            batchArray.push(uuidv4() + "#" + product.batchNumber)
            batches = batches - 1

        }

        console.log(batchArray)
        result = await contract.submitTransaction("linkBatchesToProduct", batchArray);
        console.log(`result is : ${result}`)

    }


    await gateway.disconnect();

    result = JSON.parse(result.toString());

    let response = {
        message: message,
        result
    }

    return response;


    // } catch (error) {

    //     console.log(`Getting error: ${error}`)
    //     return error.message

    // }
}


invokeTransaction("mychannel", "fabcar", "", [], "pavan02", "Org1")