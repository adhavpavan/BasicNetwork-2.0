import React, { useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import APIClient from '../../api/APIClient';

const CreateAnAsset = ({show, handleClose, setData}) => {
    const [key, setKey] = useState('')
    const [manufacturer, setManufacturer] = useState('')
    const [name, setName] = useState('')
    const [serialNumber, setSerialNumber] = useState('')
    const [ownerId, setOwnerId] = useState('')
    const [ownerName, setOwnerName] = useState('')
    
    const handleSubmit = () => {
        if( key.trim()!='' && manufacturer.trim()!='' && name.trim()!='' && serialNumber.trim()!='' && ownerId.trim()!='' && ownerName.trim()!=''){
            APIClient.createAnAsset({
                args: [key, manufacturer, name, serialNumber, ownerId, ownerName]
            })
            .then((rs) => {
                console.log(rs)
                if(rs.data.error == null){
                    alert("Create successfully!");
                    window.open('/','_self')
                }else{
                    alert("Create failed!");
                }
            })
        }
    }

    return (
        <div className='create-an-asset'>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Create An Asset</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className='label'>Key</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="key"
                                value={key}
                                onChange={(e) => setKey(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className='label'>Manufacturer</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Manufacturer"
                                value={manufacturer}
                                onChange={(e) => setManufacturer(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className='label'>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className='label'>Serial Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Serial Number"
                                value={serialNumber}
                                onChange={(e) => setSerialNumber(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className='label'>Owner ID</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Owner ID"
                                value={ownerId}
                                onChange={(e) => setOwnerId(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className='label'>Owner Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Owner Name"
                                value={ownerName}
                                onChange={(e) => setOwnerName(e.target.value)}
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

export default CreateAnAsset;