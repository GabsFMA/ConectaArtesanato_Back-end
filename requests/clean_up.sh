#!/bin/bash
source config.env

echo "Limpando arquivos de estado..."
rm -f "$CLIENT_TOKEN_FILE" "$ARTISAN_TOKEN_FILE" "$ARTISAN_ID_FILE" \
      "$CLIENT_EMAIL_FILE" "$ARTISAN_EMAIL_FILE"
echo "Arquivos de estado removidos."