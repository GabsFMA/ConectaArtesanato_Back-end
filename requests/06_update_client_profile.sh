#!/bin/bash
source config.env

if [ ! -f "$CLIENT_TOKEN_FILE" ]; then
    echo "Erro: Arquivo de token do cliente (${CLIENT_TOKEN_FILE}) não encontrado."
    exit 1
fi

TOKEN=$(cat "$CLIENT_TOKEN_FILE")
echo "--- 6. Atualizando Perfil do Cliente ---"

curl -s -X PUT \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Cliente de Teste (Nome Editado)",
    "phone": ["+5571933334444"]
  }' \
  "${BASE_URL}/profile/me" | jq .

echo ""
read -p "Aperte Enter para continuar..."