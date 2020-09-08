#!/bin/bash
docker build -t marcusbuffett/rentseeker-server:latest .
docker push marcusbuffett/rentseeker-server:latest
kubectl rollout restart deployment rentseeker-server
