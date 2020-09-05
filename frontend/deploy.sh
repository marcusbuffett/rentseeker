#!/bin/bash
docker build -t marcusbuffett/house-calculator:latest .
docker push marcusbuffett/house-calculator:latest
kubectl rollout restart deployment house-calc
