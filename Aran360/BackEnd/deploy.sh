#!/bin/bash
set -e

APP_IMAGE="aran360-app"
APP_CONTAINER="aran360-app"
RUNTIME_IMAGE="lab-runtime"
RUNTIME_CONTAINER="lab-runtime"
NETWORK_NAME="lab-net"
PORT="8765"

echo "======================================="
echo "                Aran360                "
echo "======================================="

echo "[+] Compiling LabRuntimeServer..."
cd ..
javac BackEnd/LabRuntimeServer.java -d .
cd -

if ! docker info > /dev/null 2>&1; then
    echo "[ERROR] Docker is not running."
    exit 1
fi

echo "[+] Removing active lab containers..."
for LAB in $(docker ps -a --format '{{.Names}}' | grep -E '^lab_.+_[a-f0-9]{8}$' || true); do
    echo "    Removing lab: $LAB"
    docker rm -f "$LAB" 2>/dev/null || true
done

echo "[+] Removing Aran360 containers..."
docker rm -f $APP_CONTAINER     2>/dev/null || true
docker rm -f $RUNTIME_CONTAINER 2>/dev/null || true

echo "[+] Removing Aran360 images..."
# docker rmi $APP_IMAGE     2>/dev/null || true
# docker rmi $RUNTIME_IMAGE 2>/dev/null || true

echo "[+] Removing Aran360 network..."
docker network rm $NETWORK_NAME 2>/dev/null || true

echo "[+] Creating Docker network: $NETWORK_NAME"
docker network create $NETWORK_NAME

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

echo "---------------------------------------"
echo "[✓] Aran360 running at:"
echo "    http://localhost:$PORT"
echo "---------------------------------------"