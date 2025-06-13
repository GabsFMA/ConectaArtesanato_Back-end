#!/bin/bash
source config.env

if [ ! -f "$CLIENT_TOKEN_FILE" ]; then
    echo "Erro: Arquivo de token do cliente (${CLIENT_TOKEN_FILE}) não encontrado."
    echo "Execute o script '03_login_client.sh' primeiro."
    exit 1
fi

TOKEN=$(cat "$CLIENT_TOKEN_FILE")
echo "--- 5. Visualizando Perfil Protegido do Cliente ---"

curl -s -X GET \
  -H "Authorization: Bearer ${TOKEN}" \
  "${BASE_URL}/profile/me" | jq .

echo ""
read -p "Aperte Enter para continuar..."