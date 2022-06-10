# Auth_Network

This is a school project for Cryptography teached by Dr.Nguyen Tan Khoi at Danang University of Science and Technology.

Implement a hyperledger fabric network named Asset Authentication Network

# Prerequisites:
- Ubuntu 18
- Docker, docker compose
- npm, node
- Go
- Hyperledger Fabric Binaries and docker images
-> they have to be added into linux path

# Run:
1. Delete all old cryptographic file in api 1.4
2. Regenerate all crypto material in artifact by rerunning artifacts/channel/create-artifacts.sh
3. Start the network by running start.sh
4. Start the api server by running "node api-1.4/app.js" 

# Interact with the api server using these endpoints:
1. Import this collection of endpoint using Postman: https://www.getpostman.com/collections/401b1a02ed1330385449
2. Config your collection variable to suitable values.
3. First to register a user to get an access token.
4. Use that access token to trigger all other endpoints.

# Features:
1. Create,
2. Manage ownership,
3. and delete an ownership.
