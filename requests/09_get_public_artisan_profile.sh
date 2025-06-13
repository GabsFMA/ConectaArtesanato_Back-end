#!/bin/bash
source config.env

if [ ! -f "$ARTISAN_ID_FILE" ]; then
    echo "Erro: Arquivo de ID do artesão (${ARTISAN_ID_FILE}) não encontrado."
    echo "Execute o script '02_register_artisan.sh' primeiro."
    exit 1
fi

ARTISAN_ID=$(cat "$ARTISAN_ID_FILE")
echo "--- 9. Visualizando Perfil Público do Artesão (ID: ${ARTISAN_ID}) ---"

curl -s -X GET \
  "${BASE_URL}/artisans/${ARTISAN_ID}" | jq .

echo ""
read -p "Aperte Enter para continuar..."