import React from 'react';
import { Table } from 'react-bootstrap';

const HistoryAssetTable = ({data, asset}) => {
    console.log({data});
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
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((_data, index) => {
                           if( _data.Record.isdelete == false)
                            return(
                                <tr key={index}>
                                    <td>{asset}</td>
                                    <td>{_data.Record.manufacturer}</td>
                                    <td>{_data.Record.name}</td>
                                    <td>{_data.Record.serialnumber}</td>
                                    <td>{_data.Record.ownerid}</td>
                                    <td>{_data.Record.ownername}</td>
                                    <td>{_data.Record.registerdate}</td>
                                    <td>{_data.Record.lastupdatedate}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
        </div>
    );
};

export default HistoryAssetTable;