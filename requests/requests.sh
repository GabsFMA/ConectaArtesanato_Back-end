#!/bin/bash

# --- Configurações ---
BASE_URL="http://localhost:3001/api"
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# --- Dados de Teste ---
CLIENT_EMAIL="cliente.final.user2@email.com"
CLIENT_PASS="ClienteForte123!"
ARTISAN_EMAIL="artesao.completo.user2@email.com"
ARTISAN_PASS="ArtesaoForte123!"

# --- Funções Auxiliares ---
function pause(){
  echo ""
  read -s -n 1 -p "Pressione qualquer tecla para continuar para o próximo passo..."
  echo -e "\n\n============================================================\n"
}

# --- Funções de Teste ---

function test_health_check() {
  echo -e "${YELLOW}--- 1. Testando Health Check (Rota Pública) ---${NC}"
  curl -s -X GET "${BASE_URL}/health" | jq .
}

function register_client() {
  echo -e "${YELLOW}--- 2. Testando Cadastro de Cliente ---${NC}"
  curl -s -X POST -H "Content-Type: application/json" -d "{
    \"fullName\": \"Cliente Final da Silva\",
    \"email\": \"${CLIENT_EMAIL}\",
    \"password\": \"${CLIENT_PASS}\",
    \"role\": \"client\"
  }" "${BASE_URL}/auth/register" | jq .
}

# <-- MUDANÇA PRINCIPAL AQUI ---
# A função de cadastro do artesão agora envia todos os campos necessários.
function register_artisan() {
  echo -e "\n${YELLOW}--- 3. Testando Cadastro Completo de Artesão ---${NC}"
  curl -s -X POST -H "Content-Type: application/json" -d "{
    \"fullName\": \"Artesão de Cadastro Completo\",
    \"email\": \"${ARTISAN_EMAIL}\",
    \"password\": \"${ARTISAN_PASS}\",
    \"role\": \"artisan\",
    \"brandName\": \"Mãos Criativas do Sertão\",
    \"cpf_cnpj\": \"11122233344556\",
    \"birthDate\": \"1988-07-20\",
    \"phone\": [\"+5571988887777\"],
    \"description\": \"Peças que unem tradição e modernidade.\",
    \"artInfo\": \"Especialista em esculturas com madeira de reuso.\",
    \"addresses\": [
      {
        \"street\": \"Rua da Inspiração\",
        \"number\": \"123\",
        \"neighborhood\": \"Pelourinho\",
        \"city\": \"Salvador\",
        \"state\": \"BA\",
        \"zipCode\": \"40026-010\",
        \"type\": \"Comercial\"
      }
    ]
  }" "${BASE_URL}/auth/register" | jq .
}

function login_user() {
  local email=$1
  local password=$2
  echo -e "\n${YELLOW}--- Testando Login para o usuário: ${email} ---${NC}"
  TOKEN=$(curl -s -X POST -H "Content-Type: application/json" -d "{
    \"email\": \"${email}\",
    \"password\": \"${password}\"
  }" "${BASE_URL}/auth/login" | jq -r .token)
  echo $TOKEN
}

function get_my_profile() {
  local token=$1
  echo -e "\n${YELLOW}--- Testando Busca de Perfil (Rota Protegida) ---${NC}"
  curl -s -H "Authorization: Bearer ${token}" "${BASE_URL}/profile/me" | jq .
}

function update_my_profile() {
  local token=$1
  local payload=$2
  echo -e "\n${YELLOW}--- Testando Edição de Perfil (Rota Protegida) ---${NC}"
  curl -s -X PUT -H "Authorization: Bearer ${token}" -H "Content-Type: application/json" -d "${payload}" "${BASE_URL}/profile/me" | jq .
}

# ------ EXECUÇÃO DO SCRIPT ------

test_health_check
pause

register_client
pause

register_artisan
pause

# --- FLUXO DE TESTE DO CLIENTE ---
echo -e "${CYAN}### INICIANDO FLUXO DE TESTE DO CLIENTE ###${NC}"
CLIENT_TOKEN=$(login_user "$CLIENT_EMAIL" "$CLIENT_PASS")

if [ -z "$CLIENT_TOKEN" ] || [ "$CLIENT_TOKEN" == "null" ]; then
    echo "!!! Falha ao obter token de cliente."
else
    echo -e "${GREEN}Token de Cliente obtido com sucesso.${NC}"
    pause
    get_my_profile "$CLIENT_TOKEN"
    pause
    update_my_profile "$CLIENT_TOKEN" '{"phone": ["+5571911112222"], "fullName": "Cliente Final da Silva (Editado)"}'
fi
pause

# --- FLUXO DE TESTE DO ARTESÃO ---
echo -e "${CYAN}### INICIANDO FLUXO DE TESTE DO ARTESÃO ###${NC}"
ARTISAN_TOKEN=$(login_user "$ARTISAN_EMAIL" "$ARTISAN_PASS")

if [ -z "$ARTISAN_TOKEN" ] || [ "$ARTISAN_TOKEN" == "null" ]; then
    echo "!!! Falha ao obter token de artesão."
else
    echo -e "${GREEN}Token de Artesão obtido com sucesso.${NC}"
    pause
    get_my_profile "$ARTISAN_TOKEN"
    pause
    update_my_profile "$ARTISAN_TOKEN" '{"artInfo": "Minha nova informação de arte, atualizada pelo script."}'
fi

echo -e "\n${GREEN}Script de verificação final concluído.${NC}"