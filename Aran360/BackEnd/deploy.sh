#!/bin/bash
set -e

APP_IMAGE="aran360-app"
APP_CONTAINER="aran360-app"
RUNTIME_IMAGE="lab-runtime"
RUNTIME_CONTAINER="lab-runtime"
NETWORK_NAME="lab-net"
PORT="8765"

echo "========================================"
echo "   Aran360 - Full Stack Deploy"
echo "========================================"

if ! docker info > /dev/null 2>&1; then
    echo "[ERROR] Docker is not running."
    exit 1
fi

if ! docker network inspect $NETWORK_NAME > /dev/null 2>&1; then
    echo "[+] Creating Docker network: $NETWORK_NAME"
    docker network create $NETWORK_NAME
fi

for C in $APP_CONTAINER $RUNTIME_CONTAINER; do
    if docker ps -a --format '{{.Names}}' | grep -q "^${C}$"; then
        echo "[+] Removing existing container: $C"
        docker rm -f $C
    fi
done

echo "[+] Building runtime server image..."
docker build -t $RUNTIME_IMAGE -f ../Dockerfile ..

echo "[+] Starting runtime container..."
docker run -d \
  --name $RUNTIME_CONTAINER \
  --network $NETWORK_NAME \
  -p 9000:9000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  $RUNTIME_IMAGE

echo "[+] Building Aran360 image..."
docker build -t $APP_IMAGE .

echo "[+] Starting app container..."
docker run -d \
  --name $APP_CONTAINER \
  --network $NETWORK_NAME \
  -p $PORT:8080 \
  --add-host=host.docker.internal:host-gateway \
  $APP_IMAGE

echo "----------------------------------------"
echo "[✓] Aran360 running at:"
echo "    http://localhost:$PORT"
echo "----------------------------------------"
