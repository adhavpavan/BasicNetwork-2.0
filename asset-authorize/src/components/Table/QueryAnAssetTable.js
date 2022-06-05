import React from 'react';
import { Form } from 'react-bootstrap';

const QueryAnAssetTable = ({ data }) => {
    return (
        <div className='query-an-asset-form'>
            {data.isdelete == false ?
                <Form className='form-query-an-asset'>
                    <Form.Group className="mb-3">
                        <Form.Label className='label'>Manufacturer</Form.Label>
                        <Form.Control
                            type="text"
                            readOnly
                            value={data.manufacturer}

                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className='label'>Name</Form.Label>
                        <Form.Control
                            type="text"
                            readOnly
                            value={data.name}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className='label'>Serial number</Form.Label>
                        <Form.Control
                            type="text"
                            readOnly
                            value={data.serialnumber}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className='label'>Owner ID</Form.Label>
                        <Form.Control
                            type="text"
                            readOnly
                            value={data.ownerid}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className='label'>Owner name</Form.Label>
                        <Form.Control
                            type="text"
                            readOnly
                            value={data.ownername}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className='label'>Register date</Form.Label>
                        <Form.Control
                            type="text"
                            readOnly
                            value={data.registerdate}

                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className='label'>Last update date</Form.Label>
                        <Form.Control
                            type="text"
                            readOnly
                            value={data.lastupdatedate}

                        />
                    </Form.Group>
                </Form>
                : <h3>NONE</h3>
            }
        </div>
    );
};

export default QueryAnAssetTable;