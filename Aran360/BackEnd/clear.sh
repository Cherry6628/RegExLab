#!/bin/bash

docker stop $(docker ps -qa)
docker rm $(docker ps -qa)
docker system df
docker system prune -a --volumes -f
docker system df
