import React, { useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import APIClient from '../../api/APIClient';
import ChangeAsset from '../Modal/ChangeAsset';

const QueryAllAssetTable = ({ data, setData }) => {
    const [showChangeModal, setShowChangeModal] = useState(false)
    const [keyChange, setKeyChange] = useState('')
    const handleDelete = (key) => {
        APIClient.deleteAnAsset({
            args: [key]
        }).then((rs) => {
            if(rs.data.error == null){
                alert('Delete successfully!')
                window.open('/', '_self')
            }else{
                alert('Delete failed!')
            }
        })
    }
    const handleShowHistory = (asset) => {
        APIClient.getHistoryanAsset({
            args:  `["${asset}"]`,
            peer: 'peer0.gov.assetauth.vn',
            fcn: 'getHistoryForAsset'
        }).then((rs) => {
            setData({
                data: rs.data,
                name:'history asset',
                asset: asset
            })
        })
    }
    return (
        <div className='all-asset-table'>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Key</th>
                        <th>Manufacturer</th>
                        <th>Name</th>
                        <th>Serial number</th>
                        <th>Owner ID</th>
                        <th>Owner name</th>
                        <th>Register date</th>
                        <th>Last update date</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((_data, index) => {
                           if( _data.Record.isdelete == false)
                            return(
                                <tr key={index}>
                                <td>{_data.Key}</td>
                                <td>{_data.Record.manufacturer}</td>
                                <td>{_data.Record.name}</td>
                                <td>{_data.Record.serialnumber}</td>
                                <td>{_data.Record.ownerid}</td>
                                <td>{_data.Record.ownername}</td>
                                <td>{_data.Record.registerdate}</td>
                                <td>{_data.Record.lastupdatedate}</td>
                                <td style={{display:'flex'}}>
                                    <Button className='option' variant="danger" onClick={() => handleDelete(_data.Key)} size="sm" style={{marginRight:'5px'}}>Delete</Button>
                                    <Button className='option' variant="info" size="sm" onClick={() =>{
                                        setKeyChange(_data.Key)
                                        setShowChangeModal(true)
                                    }}>EDIT</Button>
                                    <Button className='option' variant="info" size="sm" onClick={() =>{
                                        handleShowHistory(_data.Key)
                                    }}>History</Button>
                                </td>
                            </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
            <ChangeAsset show={showChangeModal} handleClose={()=>setShowChangeModal(false)} asset={keyChange}/>
        </div>
    );
};

export default QueryAllAssetTable;