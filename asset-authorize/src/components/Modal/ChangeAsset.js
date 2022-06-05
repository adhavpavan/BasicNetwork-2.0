import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import APIClient from '../../api/APIClient';

const ChangeAsset = ({ asset, show, handleClose, setData }) => {
    const [ownerId, setOwnerId] = useState('')
    const [ownerName, setOwnerName] = useState('')

    const handleSubmit = () => {
        if (ownerId.trim() != '' && ownerName.trim() != '') {
            APIClient.changeAsset({
                args: [asset, ownerId, ownerName],
            })
                .then(rs => {
                    if (rs.data.error == null) {
                        window.open('./', '_self')
                        handleClose()
                    } else {
                        alert("Server Error!")
                    }
                })
        }
    }

    return (
        <div className='change-asset-owner'>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Change An Asset's Owner</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
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
                    <Button variant="primary" onClick={() => handleSubmit()}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ChangeAsset;