import React, { useState } from 'react';
import {Button, Form} from 'react-bootstrap'
import APIClient from '../../api/APIClient';

const Register = () => {
    const [user, setUser] = useState('');
    const [org, setOrg] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault()
        APIClient.getTokenRegister({
            orgName: org,
            username: user,
        })
        .then((rs) => {
            if(rs.status === 200) {
                localStorage.setItem('token', rs.data.token)
                window.open('/', '_self')
            }
        })
    }
    return (
        <div className='register-component'>
            <div className='form-register'>
                <h3>REGISTER FORM</h3>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className='lable-register'>Username:</Form.Label>
                        <Form.Control
                            type="text" 
                            placeholder="username" 
                            name='username'
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className='lable-register'>OrgName:</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="OrgName" 
                            name='orgname'
                            value={org}
                            onChange={(e) => setOrg(e.target.value)}
                        />
                    </Form.Group>
                    <Button type='submit' variant="light">Register</Button>
                </Form>
            </div>
        </div>
    );
};

export default Register;