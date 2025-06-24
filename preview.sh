#!/bin/bash

# Get script directory and source environment variables
SCRIPT_PATH="$(realpath "${BASH_SOURCE[0]}")"
SCRIPT_DIR="$(dirname "$SCRIPT_PATH")"
source $SCRIPT_DIR/.env

# Function to cleanup background processes on exit
cleanup() {
    echo "Shutting down..."
    if [ ! -z "$QUARTZ_PID" ]; then
        kill $QUARTZ_PID 2>/dev/null
    fi
    if [ ! -z "$RSYNC_PID" ]; then
        kill $RSYNC_PID 2>/dev/null
    fi
    exit 0
}

# Set up signal handlers to cleanup on exit
trap cleanup SIGINT SIGTERM EXIT

# Initial sync
echo "Performing initial content sync..."
rsync -a --delete "${WEBSITE_VAULT_PATH%/}/" $SCRIPT_DIR/quartz/content/

# Start Quartz build server in background
echo "Starting Quartz build server..."
cd quartz
npx quartz build --serve &
QUARTZ_PID=$!
cd ..

# Start continuous rsync in background (sync every 2 seconds)
echo "Starting continuous content sync..."
while true; do
    rsync -a --delete "${WEBSITE_VAULT_PATH%/}/" $SCRIPT_DIR/quartz/content/ >/dev/null 2>&1
    sleep 1
done &
RSYNC_PID=$!

echo "Preview server running. Press Ctrl+C to stop."
echo "Quartz server PID: $QUARTZ_PID"
echo "Rsync process PID: $RSYNC_PID"

# Wait for background processes
wait

