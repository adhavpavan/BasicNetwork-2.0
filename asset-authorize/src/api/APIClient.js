// import axiosClient from "./axiosClient";
import axios from 'axios';
import axiosClient from './axiosClient';

const getTokenRegister = (data) => {
    const url = 'http://113.174.169.248:4000/users';
    return axios.post(url, data, {
        headers: {
            'content-type': 'application/json',
        }
    });
}

const queryAnAsset = (param) => {
    console.log(localStorage.getItem('token'))
    const url ='channels/mychannel/chaincodes/asset'
    return axiosClient.get(
        url,
        {params: {...param}},
    )
}

const queryAllAsset = () => {
    const url ='channels/mychannel/chaincodes/asset'
    return axiosClient.get(url,
        {params: {
            peer: 'peer0.gov.assetauth.vn',
            fcn: 'queryAllAsset',
            args: `["ASSET2", "Than", "xe hoi", "hha", "111", "DQT"]`
        }}
    )
}

const createAnAsset = (body) => {
    const url = 'channels/mychannel/chaincodes/asset';
    return axiosClient.post(url, {
        fcn: "createAsset",
        peers: ["peer0.gov.assetauth.vn", "peer0.firm.assetauth.vn"],
        chaincodeName:"asset",
        channelName: "mychannel",
        ...body
    })
}

const deleteAnAsset = (body) => {
    const url = 'channels/mychannel/chaincodes/asset';
    return axiosClient.post(url, {
        fcn: "deleteAsset",
        peers: ["peer0.gov.assetauth.vn", "peer0.firm.assetauth.vn"],
        chaincodeName:"asset",
        channelName: "mychannel",
        ...body
    })
}

const changeAsset = (body) => {
    const url = '/channels/mychannel/chaincodes/asset'
    return axiosClient.post(url, {
        fcn: "changeAssetOwner",
        peers: ["peer0.gov.assetauth.vn", "peer0.firm.assetauth.vn"],
        chaincodeName:"asset",
        channelName: "mychannel",
        ...body
    })
}

const APIClient = {
    getTokenRegister,
    queryAnAsset,
    queryAllAsset,
    createAnAsset,
    deleteAnAsset,
    changeAsset
}
export default APIClient;