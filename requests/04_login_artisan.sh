#!/bin/bash
source config.env

if [ ! -f "$ARTISAN_EMAIL_FILE" ]; then
    echo "Erro: Arquivo de e-mail do artesão (${ARTISAN_EMAIL_FILE}) não encontrado."
    echo "Execute o script '02_register_artisan.sh' primeiro."
    exit 1
fi

ARTISAN_EMAIL=$(cat "$ARTISAN_EMAIL_FILE")

echo "--- 4. Realizando Login do Artesão ---"
echo "Usando Email: ${ARTISAN_EMAIL}"

response=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${ARTISAN_EMAIL}\",
    \"password\": \"${ARTISAN_PASS}\"
  }" \
  "${BASE_URL}/auth/login")

echo "$response" | jq .

token=$(echo "$response" | jq -r .token)
if [ "$token" != "null" ]; then
  echo "$token" > "$ARTISAN_TOKEN_FILE"
  echo "Token do Artesão salvo em ${ARTISAN_TOKEN_FILE}"
fi

echo ""
read -p "Aperte Enter para continuar..."