
docker-compose -f ./artifacts/docker-compose.yaml down -v


docker-compose -f ./artifacts/docker-compose.yaml up -d

sleep 5
./createChannel.sh

sleep 2

./deployChaincodeContractApi.sh