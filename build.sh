SCRIPT_PATH="$(realpath "${BASH_SOURCE[0]}")"
SCRIPT_DIR="$(dirname "$SCRIPT_PATH")"
source $SCRIPT_DIR/.env
rsync -a --delete "${WEBSITE_VAULT_PATH%/}/" $SCRIPT_DIR/quartz/content/

cd quartz
npm i
npx quartz build
cd ..
