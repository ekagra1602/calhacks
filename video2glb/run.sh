#!/bin/bash

docker run --gpus all \
    -v $(pwd):/workspace/ \
    -v /home/zeus/.cache/:/home/user/.cache/ \
    -p 7007:7007 \
    -it \
    --shm-size=12gb \
    ghcr.io/nerfstudio-project/nerfstudio:latest
