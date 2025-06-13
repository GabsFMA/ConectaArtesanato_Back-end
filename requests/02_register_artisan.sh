#!/bin/bash
source config.env

echo "--- 2. Registrando um novo Artesão ---"

# Gera um e-mail único e o salva para uso posterior
TIMESTAMP=$(date +%s)
ARTISAN_EMAIL="artesao.${TIMESTAMP}@email.com"
echo "$ARTISAN_EMAIL" > "$ARTISAN_EMAIL_FILE"

echo "Email gerado: ${ARTISAN_EMAIL} (salvo em ${ARTISAN_EMAIL_FILE})"

# Faz a requisição e captura a resposta
response=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "{
    \"fullName\": \"Artesão Mestre do Teste\",
    \"email\": \"${ARTISAN_EMAIL}\",
    \"password\": \"${ARTISAN_PASS}\",
    \"role\": \"artisan\",
    \"brandName\": \"Arte & Teste\",
    \"cpf_cnpj\": \"${TIMESTAMP}123456\",
    \"birthDate\": \"1985-10-22\",
    \"phone\": [\"+5571999998888\"],
    \"description\": \"Criando arte para testes.\",
    \"artInfo\": \"Especialista em esculturas de código.\",
    \"addresses\": [{
        \"street\": \"Rua dos Scripts\", \"number\": \"101\",
        \"neighborhood\": \"Centro\", \"city\": \"Salvador\",
        \"state\": \"BA\", \"zipCode\": \"40020-000\", \"type\": \"Comercial\"
    }]
  }" \
  "${BASE_URL}/auth/register")

echo "$response" | jq .

artisan_id=$(echo "$response" | jq -r .user._id)
if [ "$artisan_id" != "null" ]; then
  echo "$artisan_id" > "$ARTISAN_ID_FILE"
  echo "ID do Artesão salvo em ${ARTISAN_ID_FILE}"
fi

echo ""
read -p "Aperte Enter para continuar..."