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
	let postData = await createPostData(pk.toString(), data)
	// console.log("before AXIOS call", postData)

	return axios.post(url, postData, conf
	).then(function (response) { console.log(`${pk.toString()} => `, response.data); }
	).catch(function (error) { console.log(error); });

};
