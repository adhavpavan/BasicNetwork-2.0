export FABRIC_CA_CLIENT_HOME=${PWD}/clients/admin

EnrollAdmin() {

    fabric-ca-client enroll -u https://admin:adminpw@localhost:7054 --caname ca.org1.example.com --tls.certfiles ${PWD}/fabric-ca/tls-cert.pem

}

# EnrollAdmin

RegisterNewAdmin() {
    # export FABRIC_CA_CLIENT_HOME=${PWD}/clients/admin2
    # fabric-ca-client register --id.name admin2 --id.affiliation org1.department1 --id.attrs 'hf.Revoker=true,admin=true:ecert'
    # fabric-ca-client register -d --id.name admin2 --id.affiliation org1.department1 --id.attrs '"hf.Registrar.Roles=peer,client"' --id.attrs hf.Revoker=true
    fabric-ca-client register \
        --caname ca.org1.example.com \
        --id.name admin3 \
        --id.secret admin3pw \
        --id.type admin \
        --id.attrs 'hf.Revoker=true,admin=true:ecert' \
        --id.affiliation org1.department1 \
        --tls.certfiles ${PWD}/fabric-ca/tls-cert.pem
}

# RegisterNewAdmin

RegisterPeer() {
    fabric-ca-client register \
        --caname ca.org1.example.com \
        --id.name peer4 \
        --id.secret peer4pw \
        --id.type peer \
        --id.affiliation org1.department1 \
        --id.attrs '"hf.Registrar.Roles=peer,client"' \
        --id.attrs hf.Revoker=true \
        --tls.certfiles ${PWD}/fabric-ca/tls-cert.pem

    # fabric-ca-client register \
    #     --caname ca.org1.example.com \
    #     --id.name peer3 \
    #     --id.type peer \
    #     --id.affiliation org1.department1 \
    #     --id.attrs '"hf.Registrar.Roles=peer,client"' \
    #     --id.attrs hf.Revoker=true \
    #     --tls.certfiles ${PWD}/fabric-ca/tls-cert.pem

}

# RegisterPeer

EnrollPeer() {

    fabric-ca-client enroll \
        -u https://peer4:peer4pw@localhost:7054 \
        --caname ca.org1.example.com \
        -M ${PWD}/clients/peer1/msp \
        --csr.hosts peer0.org1.example.com \
        --tls.certfiles ${PWD}/fabric-ca/tls-cert.pem
}

# EnrollPeer

ReenrollIdentity() {

    export FABRIC_CA_CLIENT_HOME=${PWD}/clients/peer1
    fabric-ca-client \
        reenroll \
        -u https://peer4:peer4pw@localhost:7054 \
        --caname ca.org1.example.com \
        --tls.certfiles ${PWD}/fabric-ca/tls-cert.pem
}

# ReenrollIdentity

RevokeIdentity() {
    export FABRIC_CA_CLIENT_HOME=${PWD}/clients/admin
    fabric-ca-client revoke \
        -e peer4 \
        -r keycompromise \
        --gencrl \
        --tls.certfiles ${PWD}/fabric-ca/tls-cert.pem

}

# RevokeIdentity

GetIdentityInfo() {

    fabric-ca-client identity list --id peer1 --tls.certfiles ${PWD}/fabric-ca/tls-cert.pem

}

# GetIdentityInfo

GetIdentityList() {
    fabric-ca-client identity list --tls.certfiles ${PWD}/fabric-ca/tls-cert.pem

}

GetIdentityList

# Add new identity with json string ot flags
AddNewIdentity() {

    fabric-ca-client identity add user1 \
        --tls.certfiles ${PWD}/fabric-ca/tls-cert.pem \
        --json '{"secret": "user1pw", "type": "client", "affiliation": "org1", "max_enrollments": 1, "attrs": [{"name": "hf.Revoker", "value": "true"}]}'

    fabric-ca-client identity add user1 \
        --secret user1pw \
        --type client \
        --affiliation . \
        --maxenrollments 1 \
        --attrs hf.Revoker=true \
        --tls.certfiles ${PWD}/fabric-ca/tls-cert.pem
}

ModifyIdentity() {

    fabric-ca-client identity modify user1 \
        --tls.certfiles ${PWD}/fabric-ca/tls-cert.pem \
        --json '{"secret": "newPassword", "affiliation": ".", "attrs": [{"name": "hf.Regisrar.Roles", "value": "peer,client"},{"name": "hf.Revoker", "value": "true"}]}'

    fabric-ca-client identity modify user1 --secret newsecret

    fabric-ca-client identity modify user1 --affiliation org2

    fabric-ca-client identity modify user1 --type peer

    fabric-ca-client identity modify user1 --maxenrollments 5

    # By specifying a maxenrollments value of ‘-2’, the following causes identity ‘user1’ to use the CA’s max enrollment setting.
    fabric-ca-client identity modify user1 --maxenrollments -2

    fabric-ca-client identity modify user1 --attrs hf.Revoker=false

    fabric-ca-client identity modify user1 --attrs hf.Revoker=

    fabric-ca-client identity modify user1 --secret newpass --type peer

}

RemoveIdentity() {

    fabric-ca-client identity remove user1

}

AffiliationOperations() {
    # Add
    fabric-ca-client affiliation add org1.dept1

    # Modify
    fabric-ca-client affiliation modify org2 --name org3

    # Remove
    fabric-ca-client affiliation remove org2

    # Get All Affiliation
    fabric-ca-client affiliation list

    # Get All with specific affliliation
    fabric-ca-client affiliation list --affiliation org2.dept1

}

CertificateList() {

    # The certificates which will be listed may be filtered based on ID, AKI, serial number, expiration time, revocation time, notrevoked, and notexpired flags.

    # id: List certificates for this enrollment ID
    # serial: List certificates that have this serial number
    # aki: List certificates that have this AKI
    # expiration: List certificates that have expiration dates that fall within this expiration time
    # revocation: List certificates that were revoked within this revocation time
    # notrevoked: List certificates that have not yet been revoked
    # notexpired: List certificates that have not yet expired

    fabric-ca-client certificate list
    fabric-ca-client certificate list --id admin
    fabric-ca-client certificate list --serial 1234 --aki 1234
    fabric-ca-client certificate list --id admin --serial 1234 --aki 1234
    fabric-ca-client certificate list --id admin --notrevoked --notexpired
    fabric-ca-client certificate list --id admin --notrevoked
    fabric-ca-client certificate list --id admin --notexpired

    # List all certificates that were revoked between a time range for an id (admin):
    fabric-ca-client certificate list --id admin --revocation 2018-01-01T01:30:00z::2018-01-30T05:00:00z
    fabric-ca-client certificate list --id admin --revocation 2018-01-01::2018-01-30 --notexpired

    # List all revoked certificates using duration (revoked between 30 days and 15 days ago) for an id (admin)
    fabric-ca-client certificate list --id admin --revocation -30d::-15d

    # fabric-ca-client certificate list --revocation ::2018-01-30
    fabric-ca-client certificate list --revocation ::2018-01-30

    # List all revoked certificates before a time
    fabric-ca-client certificate list --revocation ::2018-01-30

    # List all revoked certificates after a time
    fabric-ca-client certificate list --revocation 2018-01-30::

    # List all revoked certificates before now and after a certain da
    fabric-ca-client certificate list --id admin --revocation 2018-01-30::now

    # List all certificate that expired between a time range but have not been revoked for an id (admin):
    fabric-ca-client certificate list --id admin --expiration 2018-01-01::2018-01-30 --notrevoked

    # List all expired certificates using duration (expired between 30 days and 15 days ago) for an id (admin):
    fabric-ca-client certificate list --expiration -30d::-15d

    # List all certificates that have expired or will expire before a certain time
    fabric-ca-client certificate list --expiration ::2058-01-30

    # List all certificates that have expired or will expire after a certain time
    fabric-ca-client certificate list --expiration 2018-01-30::

    # List all expired certificates before now and after a certain date
    fabric-ca-client certificate list --expiration 2018-01-30::now

    # List certificates expiring in the next 10 days:
    fabric-ca-client certificate list --id admin --expiration ::+10d --notrevoked

}
