# Teia21 Backend

Backend em NestJS para o Instituto Teia 21.

## Requisitos

- Node.js 18+
- PostgreSQL 15+ (ou Docker)

## Configuracao

1. Copie o arquivo de ambiente:
```bash
cp .env.example .env
```

2. Configure as variaveis no `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=teia21
PORT=3001
API_KEY=sua-chave-secreta-aqui
```

## Banco de Dados

### Opcao 1: Docker (Recomendado)
```bash
docker-compose up -d
```

### Opcao 2: PostgreSQL Local
Crie o banco de dados:
```sql
CREATE DATABASE teia21;
```

## Executar

```bash
# Instalar dependencias
npm install

# Desenvolvimento
npm run start:dev

# Producao
npm run build
npm run start:prod
```

## Seguranca

### API Key
Endpoints protegidos requerem o header `x-api-key`:
```
x-api-key: sua-chave-secreta-aqui
```

### Rate Limiting
O endpoint POST /api/contact possui rate limit de **3 requisicoes por minuto por IP**.

## API Endpoints

### Contato

| Metodo | Endpoint | Protegido | Rate Limit | Descricao |
|--------|----------|-----------|------------|-----------|
| POST | /api/contact | Nao | 3/min | Criar novo contato |
| GET | /api/contact | API Key | - | Listar todos os contatos |
| GET | /api/contact/stats | API Key | - | Estatisticas de contatos |
| GET | /api/contact/unread | API Key | - | Listar contatos nao lidos |
| GET | /api/contact/:id | API Key | - | Buscar contato por ID |
| PATCH | /api/contact/:id | API Key | - | Atualizar contato |
| PATCH | /api/contact/:id/read | API Key | - | Marcar como lido |
| PATCH | /api/contact/:id/responded | API Key | - | Marcar como respondido |
| DELETE | /api/contact/:id | API Key | - | Remover contato |

### Exemplos de Requisicoes

#### Criar contato (publico, com rate limit)
```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nome Completo",
    "email": "email@exemplo.com",
    "phone": "(11) 99999-9999",
    "subject": "Assunto",
    "message": "Mensagem com pelo menos 10 caracteres"
  }'
```

#### Listar contatos (requer API Key)
```bash
curl http://localhost:3001/api/contact \
  -H "x-api-key: teia21-secret-api-key-2024"
```

#### Obter estatisticas (requer API Key)
```bash
curl http://localhost:3001/api/contact/stats \
  -H "x-api-key: teia21-secret-api-key-2024"
```

#### Marcar como lido (requer API Key)
```bash
curl -X PATCH http://localhost:3001/api/contact/{id}/read \
  -H "x-api-key: teia21-secret-api-key-2024"
```

### Respostas

#### Sucesso (201 Created)
```json
{
  "success": true,
  "message": "Mensagem enviada com sucesso!",
  "data": {
    "id": "uuid-do-contato"
  }
}
```

#### Erro de Rate Limit (429 Too Many Requests)
```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

#### Erro de API Key (401 Unauthorized)
```json
{
  "statusCode": 401,
  "message": "Invalid API key"
}
```

## Estrutura do Projeto

```
src/
├── common/
│   ├── decorators/
│   │   └── api-key.decorator.ts
│   └── guards/
│       └── api-key.guard.ts
├── contact/
│   ├── dto/
│   │   ├── create-contact.dto.ts
│   │   └── update-contact.dto.ts
│   ├── contact.controller.ts
│   ├── contact.entity.ts
│   ├── contact.module.ts
│   └── contact.service.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```
