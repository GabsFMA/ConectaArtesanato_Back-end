#!/bin/bash
source config.env

echo "--- 1. Registrando um novo Cliente ---"

# Gera um e-mail único e o salva para uso posterior
TIMESTAMP=$(date +%s)
CLIENT_EMAIL="cliente.${TIMESTAMP}@email.com"
echo "$CLIENT_EMAIL" > "$CLIENT_EMAIL_FILE"

echo "Email gerado: ${CLIENT_EMAIL} (salvo em ${CLIENT_EMAIL_FILE})"

curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "{
    \"fullName\": \"Cliente de Teste\",
    \"email\": \"${CLIENT_EMAIL}\",
    \"password\": \"${CLIENT_PASS}\",
    \"role\": \"client\"
  }" \
  "${BASE_URL}/auth/register" | jq .

echo ""
read -p "Aperte Enter para continuar..."