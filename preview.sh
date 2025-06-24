#!/bin/bash

# Get script directory and source environment variables
SCRIPT_PATH="$(realpath "${BASH_SOURCE[0]}")"
SCRIPT_DIR="$(dirname "$SCRIPT_PATH")"
source $SCRIPT_DIR/.env

WEBSITE_VAULT_PATH="$OBSIDIAN_VAULT_PATH/$WEBSITE_REL_PATH"

# Array to store background process PIDs
declare -a BACKGROUND_PIDS=()

# Function to cleanup background processes
cleanup() {
    echo "Cleaning up background processes..."
    for pid in "${BACKGROUND_PIDS[@]}"; do
        if kill -0 "$pid" 2>/dev/null; then
            echo "Killing process $pid"
            kill "$pid" 2>/dev/null
            # Give it a moment to terminate gracefully
            sleep 2
            # Force kill if still running
            if kill -0 "$pid" 2>/dev/null; then
                echo "Force killing process $pid"
                kill -9 "$pid" 2>/dev/null
            fi
        fi
    done
    exit 0
}

# Set up signal handlers for cleanup
trap cleanup SIGTERM SIGINT EXIT

# Function to run rsync continuously
run_rsync() {
    while true; do
        echo "Running rsync..."
        sh sync_content.sh
        if [ $? -eq 0 ]; then
            echo "Rsync completed successfully"
        else
            echo "Rsync failed with exit code $?"
        fi
        sleep 2
    done
}

# Function to start quartz server with auto-restart
start_quartz_server() {
    while true; do
        echo "Starting Quartz server..."
        cd "$SCRIPT_DIR/quartz" || {
            echo "Failed to change to quartz directory"
            sleep 10
            continue
        }
        
        npx quartz build --serve
        exit_code=$?
        
        echo "Quartz server exited with code $exit_code"
        if [ $exit_code -eq 0 ]; then
            echo "Quartz server stopped normally"
            break
        else
            echo "Quartz server crashed, restarting in 5 seconds..."
            sleep 5
        fi
    done
}

# Check if WEBSITE_VAULT_PATH is set
if [ -z "$WEBSITE_VAULT_PATH" ]; then
    echo "Error: WEBSITE_VAULT_PATH environment variable is not set"
    exit 1
fi

# Check if quartz directory exists
if [ ! -d "$SCRIPT_DIR/quartz" ]; then
    echo "Error: quartz directory not found at $SCRIPT_DIR/quartz"
    exit 1
fi

echo "Starting sync and serve processes..."
echo "Script directory: $SCRIPT_DIR"
echo "Website vault path: $WEBSITE_VAULT_PATH"

# Start rsync in background
run_rsync &
RSYNC_PID=$!
BACKGROUND_PIDS+=($RSYNC_PID)
echo "Started rsync process with PID $RSYNC_PID"

# Start quartz server in background
start_quartz_server &
QUARTZ_PID=$!
BACKGROUND_PIDS+=($QUARTZ_PID)
echo "Started Quartz server process with PID $QUARTZ_PID"

echo "Both processes started. Press Ctrl+C to stop."

# Wait for any background process to finish
wait