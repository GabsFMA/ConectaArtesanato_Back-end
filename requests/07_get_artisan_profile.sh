#!/bin/bash
source config.env

if [ ! -f "$ARTISAN_TOKEN_FILE" ]; then
    echo "Erro: Arquivo de token do artesão (${ARTISAN_TOKEN_FILE}) não encontrado."
    echo "Execute o script '04_login_artisan.sh' primeiro."
    exit 1
fi

TOKEN=$(cat "$ARTISAN_TOKEN_FILE")
echo "--- 7. Visualizando Perfil Protegido do Artesão ---"

curl -s -X GET \
  -H "Authorization: Bearer ${TOKEN}" \
  "${BASE_URL}/profile/me" | jq .

echo ""
read -p "Aperte Enter para continuar..."