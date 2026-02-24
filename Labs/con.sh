#!/bin/bash

set -e
BASE_DIR="$(pwd)"
for TARGET_DIR in "$BASE_DIR"/*/; do
    [ -d "$TARGET_DIR" ] || continue
    if [ ! -f "$TARGET_DIR/Dockerfile" ]; then
        echo "Skipping $(basename "$TARGET_DIR") — No Dockerfile found."
        continue
    fi

    IMAGE_NAME=$(basename "$TARGET_DIR" | tr '[:upper:]' '[:lower:]' | tr -cd 'a-z0-9_-')
    TAR_NAME="${IMAGE_NAME}.tar"

    echo "-----------------------------------"
    echo "Building image: $IMAGE_NAME"

    docker build -t "$IMAGE_NAME" "$TARGET_DIR"

    echo "Exporting image to: $TAR_NAME"
    docker save -o "$TAR_NAME" "$IMAGE_NAME"
done

# echo "-----------------------------------"
# echo "Stopping all containers..."
# docker stop $(docker ps -aq) 2>/dev/null || true

# echo "Removing all containers..."
# docker rm $(docker ps -aq) 2>/dev/null || true

# echo "Removing all images..."
# docker rmi $(docker images -aq) 2>/dev/null || true

# echo "Removing all volumes..."
# docker volume rm $(docker volume ls -q) 2>/dev/null || true
# 
# echo "Pruning system..."
# docker system prune -f
# docker system prune -a --volumes

echo "-----------------------------------"
echo "Done."
echo -e "\nDocker System Memory Usage:"
docker system df