@echo off
title REEF.DEV local server
cd /d "J:\Open code\Reef.dev\reef.dev"
start "" http://localhost:5300
node local-server.mjs 5300
pause
