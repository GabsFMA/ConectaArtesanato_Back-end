#!/bin/bash
source config.env

if [ ! -f "$CLIENT_EMAIL_FILE" ]; then
    echo "Erro: Arquivo de e-mail do cliente (${CLIENT_EMAIL_FILE}) não encontrado."
    echo "Execute o script '01_register_client.sh' primeiro."
    exit 1
fi

CLIENT_EMAIL=$(cat "$CLIENT_EMAIL_FILE")

echo "--- 3. Realizando Login do Cliente ---"
echo "Usando Email: ${CLIENT_EMAIL}"

response=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${CLIENT_EMAIL}\",
    \"password\": \"${CLIENT_PASS}\"
  }" \
  "${BASE_URL}/auth/login")

echo "$response" | jq .

token=$(echo "$response" | jq -r .token)
if [ "$token" != "null" ]; then
  echo "$token" > "$CLIENT_TOKEN_FILE"
  echo "Token do Cliente salvo em ${CLIENT_TOKEN_FILE}"
fi

echo ""
read -p "Aperte Enter para continuar..."