#!/bin/bash

docker run --gpus all \
    -v $(pwd):/workspace/ \
    -v /home/zeus/.cache/:/home/user/.cache/ \
    -p 8080:8080 \
    -it \
    --shm-size=12gb \
    dizvara608/gsplat:latest
