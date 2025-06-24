SCRIPT_PATH="$(realpath "${BASH_SOURCE[0]}")"
SCRIPT_DIR="$(dirname "$SCRIPT_PATH")"
source $SCRIPT_DIR/.env

WEBSITE_VAULT_PATH="$OBSIDIAN_VAULT_PATH/$WEBSITE_REL_PATH"

# The -a flag is equivalent to -rlptgoD, which means:
# -r: recursive (copy directories recursively)
# -l: copy symlinks as symlinks
# -p: preserve permissions
# -t: preserve timestamps
# -g: preserve group ownership
# -o: preserve owner (super-user only)
# -D: preserve device files and special files


TEMP_DIR="$SCRIPT_DIR/.tmp"

# Create temp directory if it doesn't exist
mkdir -p "$TEMP_DIR"

# First rsync: copy from source to temp folder
rsync -r --delete --checksum "${WEBSITE_VAULT_PATH%/}/" "$TEMP_DIR/"

# Apply sed modifications to temp folder
find "$TEMP_DIR/" -name "*.md" -type f -exec sed -i '' "s|\[\[$WEBSITE_REL_PATH/|\[\[|g" {} +

# Second rsync: copy from temp folder to final destination
rsync -rv --delete --checksum "$TEMP_DIR/" "$SCRIPT_DIR/quartz/content/"

# Clean up temp directory
rm -rf "$TEMP_DIR"