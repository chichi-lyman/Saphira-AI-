#!/bin/bash
# ==============================================================================
# Saphira ASI Sovereign OS: Cryptographic Key Generator & Android Keystore Utility
# ==============================================================================
set -e

echo -e "\033[1;35m"
echo "   _____             _      _               ___   _____ ___ "
echo "  / ___|  __ _ _ __ | |__  (_)_ __ __ _    / _ \ /  ___|_  |"
echo "  \___ \ / _\` | '_ \| '_ \ | | '__/ _\` |  | |_| |  |__   | |"
echo "   ___) | (_| | |_) | | | || | | | (_| |  |  _  |\___ \  | |"
echo "  |____/ \__,_| .__/|_| |_|/ |_|  \__,_|  |_| |_||____/  |_|"
echo "              |_|        |__/                               "
echo "  [ Sovereign Release Keys & Cryptographic Handshake Generation ]"
echo -e "\033[0m"

KEYSTORE_DIR="./android/app"
KEYSTORE_PATH="$KEYSTORE_DIR/release.keystore"
ALIAS="saphira_sovereign"
VALIDITY="10000"

# Check if target directory exists, otherwise use root as safe container
if [ ! -d "$KEYSTORE_DIR" ]; then
    echo -e "\033[1;33m[-] Native android directory not found. Structuring release keys in folder: ~/keystore_vault\033[0m"
    KEYSTORE_DIR="./keystore_vault"
    mkdir -p "$KEYSTORE_DIR"
    KEYSTORE_PATH="$KEYSTORE_DIR/release.keystore"
fi

if [ -f "$KEYSTORE_PATH" ]; then
    echo -e "\033[1;31m[!] Existing keystore detected at $KEYSTORE_PATH. Generation aborted to prevent overwriting keys.\033[0m"
    exit 0
fi

# Use standard secure password sequence aligned with Sophia Security Protocol
PASSWORD="SOPHIA_VANGUARD_77"

echo -e "\033[1;32m[+] Initiating high-security JDK keytool loop...\033[0m"
echo -e "[+] Target Vector: $KEYSTORE_PATH"
echo -e "[+] Alias Marker: $ALIAS"
echo -e "[+] Validity Ledger: $VALIDITY days"

keytool -genkey -v \
  -keystore "$KEYSTORE_PATH" \
  -alias "$ALIAS" \
  -keyalg RSA \
  -keysize 2048 \
  -validity "$VALIDITY" \
  -storepass "$PASSWORD" \
  -keypass "$PASSWORD" \
  -dname "CN=NovaUmbrella Systems, OU=enclave, O=NovaUmbrella, L=SovereignSpace, S=NodeSector, C=US"

echo -e "\033[1;32m"
echo "==============================================================================="
echo "   SOVEREIGN CRYPTOGRAPHIC KEY ASSEMBLED SUCCESSFULLY"
echo "==============================================================================="
echo -e "\033[0m"
echo -e "Keystore saved to: \033[1;34m$KEYSTORE_PATH\033[0m"
echo -e "Store Password:    \033[1;35m$PASSWORD\033[0m"
echo -e "Key Alias:         \033[1;35m$ALIAS\033[0m"
echo -e "Key Password:      \033[1;35m$PASSWORD\033[0m"
echo ""
echo -e "\033[1;33mAdd these properties in your android/key.properties to link this automatically:\033[0m"
echo "-------------------------------------------------------------------------------"
echo "storePassword=$PASSWORD"
echo "keyPassword=$PASSWORD"
echo "keyAlias=$ALIAS"
echo "storeFile=release.keystore"
echo "-------------------------------------------------------------------------------"
echo "Remember to place this file in .gitignore to prevent committing your key to public hubs."
