const axios = require("axios");
// const url = "http://192.168.0.146:4000/channels/mychannel/chaincodes/test_cc";
const url = "http://localhost:4000/channels/mychannel/chaincodes/test_cc";
let pk = null;
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1Njg2NTIwNjgsInVzZXJuYW1lIjoidGVzdF91c2VyIiwib3JnTmFtZSI6Ik9yZzEiLCJpYXQiOjE1Njg2MTYwNjh9.g9NZnhY3G2MHub9I8iH17npWONcZKHcUiUk7Cnifbkw"
let conf = {
	headers: {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json"
	}
};

let farmerCount = 15
let heapLotCount = 3
let farmerPrefix = "MP1301000"
let farmerKeyArray = []
let heapLotPrefix = "2019101"
let heapLotKeyArray = []
let tcPrefix = "ORG/TC/1802/101"
let tcKey = null

const createPostData = async (pk, data) => {
	// console.log("Inside createPostData: DATA", data)
	// console.log("Inside createPostData: JSON DATA", JSON.stringify(data))
	return {
		fcn: "CreateSampleData",
		peers: ["peer0.org1.example.com", "peer0.org2.example.com"],
		chaincodeName: "test_cc",
		channelName: "mychannel",
		args: [JSON.stringify(data), pk]
	}
}

const postFarmerData = async (pk) => {
	console.log(pk)
	let data = {
		created_at: (new Date).getTime(),
		name: 'Ramlal Oberoi',
		weight: 1000
	}
	let postData = await createPostData("cotton_purchased_2019_rabi#" + pk.toString(), data)
	// console.log("before AXIOS call", postData)

	return axios.post(url, postData, conf
	).then(function (response) { console.log(`${pk.toString()} => `, response.data); }
	).catch(function (error) { console.log(error); });

};

const postHeapLotData = async (pk, farmersList) => {
	console.log(pk, farmersList)
	let data = {
		created_at: (new Date).getTime(),
		weight: 1000,
		consumed_weight: '0',
		farmers: farmersList
	}
	let postData = await createPostData("heap_lot_created#" + pk.toString(), data)

	return axios.post(url, postData, conf
	).then(function (response) { console.log(`${pk.toString()} => `, response.data); }
	).catch(function (error) { console.log(error); });
};

const postTCData = async (pk, heapLotList) => {
	console.log(pk, heapLotList)
	let data = {
		created_at: (new Date).getTime(),
		weight: 15000,
		consumed_weight: '0',
		heap_lots: heapLotList
	}
	let postData = await createPostData("tc_created#" + pk.toString(), data)

	return axios.post(url, postData, conf
	).then(function (response) { console.log(`${pk.toString()} => `, response.data); }
	).catch(function (error) { console.log(error); });
};

const createFarmerKeys = async (seed) => {
	promises = []
	for (let i = 0; i < farmerCount; i++) {
		let postfix = (Number(seed) + i).toString().padStart(3, 0);
		let key = farmerPrefix + postfix;
		farmerKeyArray.push(key);
		// console.log(key);
		// await postFarmerData(key);
		promises.push(postFarmerData(key));
	}
	return Promise.all(promises).then(() => { console.log("Farmers Created!") })
};

const createHeapLotKeys = async (seed) => {
	promises = []
	for (let i = 0; i < heapLotCount; i++) {
		let postfix = (Number(seed) + i).toString().padStart(3, 0);
		let key = heapLotPrefix + postfix;

		heapLotKeyArray.push(key);
		// console.log(key);
		// await postHeapLotData(key, farmerKeyArray.slice(((farmerCount /
		// heapLotCount) * i), ((farmerCount / heapLotCount) * i + (farmerCount
		// / heapLotCount))));
		promises.push(postHeapLotData(key, farmerKeyArray.slice(((farmerCount / heapLotCount) * i), ((farmerCount / heapLotCount) * i + (farmerCount / heapLotCount)))));
	}
	return Promise.all(promises).then(() => { console.log("Heaplots Created!") })
};

const createTCKeys = async (seed) => {
	for (let i = 0; i < 1; i++) {
		let postfix = (Number(seed) + i).toString().padStart(3, 0);
		let key = tcPrefix + postfix;
		// console.log(`key : ${key},     ${heapLotKeyArray}`)
		await postTCData(key, heapLotKeyArray);
	}
};

const generate = async (seed) => {
	console.log('Seed value passed :  ', seed);
	await createFarmerKeys(seed)
	farmerKeyArray.length > 0 ? await createHeapLotKeys(seed) : null
	heapLotKeyArray.length > 0 ? await createTCKeys(seed) : null
}

process.argv[2] ? generate(process.argv[2]) : console.log('Please pass some seed value as argument while calling')
