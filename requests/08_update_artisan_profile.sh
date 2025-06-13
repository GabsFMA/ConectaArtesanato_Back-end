#!/bin/bash
source config.env

if [ ! -f "$ARTISAN_TOKEN_FILE" ]; then
    echo "Erro: Arquivo de token do artesão (${ARTISAN_TOKEN_FILE}) não encontrado."
    exit 1
fi

TOKEN=$(cat "$ARTISAN_TOKEN_FILE")
echo "--- 8. Atualizando Perfil do Artesão ---"

curl -s -X PUT \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "brandName": "Arte & Teste (Online)",
    "artInfo": "Minha arte foi atualizada por um script individual."
  }' \
  "${BASE_URL}/profile/me" | jq .

echo ""
read -p "Aperte Enter para continuar..."