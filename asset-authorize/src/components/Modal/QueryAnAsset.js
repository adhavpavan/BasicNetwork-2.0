import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import APIClient from '../../api/APIClient';

const QueryAnAsset = ({ show, handleClose, setData }) => {
    const [assetKey, setAssetKey] = useState('')

    const handleSubmit = () => {
        console.log(assetKey)
        if(assetKey.trim() != '') {
            APIClient.queryAnAsset({
                args: `["${assetKey}"]`,
                peer: 'peer0.gov.assetauth.vn',
                fcn: 'queryAsset'
            })
            .then(rs => {
                if(rs.data.error !== 'undefine'){
                    setData({
                        name: 'query an asset',
                        data: rs.data
                    })
                    console.log({
                        name: 'query an asset',
                        data: rs.data
                    })
                    handleClose()
                }
            })
        }
    }

    return (
        <div className='query-an-asset'>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Query An Asset</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className='label'>Asset-key</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Asset key"
                                value={assetKey}
                                onChange={(e) => setAssetKey(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={()=>handleSubmit()}>
                        Query
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default QueryAnAsset;