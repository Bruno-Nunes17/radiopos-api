# RadioPos API

A **RadioPos API** é o backend para o manual de posicionamentos radiológicos, desenvolvida com o objetivo de fornecer informações técnicas detalhadas sobre posicionamentos, critérios de avaliação, parâmetros técnicos e mídias (ilustrações e raios-X).

## 🚀 Tecnologias

Este projeto utiliza as seguintes tecnologias:

- **[Fastify](https://fastify.dev/)**: Framework web rápido e de baixo overhead.
- **[Prisma](https://www.prisma.io/)**: ORM moderno para Node.js e TypeScript.
- **[PostgreSQL](https://www.postgresql.org/)**: Banco de dados relacional.
- **[TypeScript](https://www.typescriptlang.org/)**: Superset de JavaScript com tipagem estática.
- **[Zod](https://zod.dev/)**: Validação de esquemas e tipos.
- **[Fastify JWT](https://github.com/fastify/fastify-jwt)**: Autenticação baseada em tokens.
- **[Scalar](https://scalar.com/)**: Documentação interativa da API.
- **[pnpm](https://pnpm.io/)**: Gerenciador de pacotes eficiente.

## ✨ Recursos

- **Gestão de Conteúdo**: Cadastro e organização de Categorias, Subcategorias e Incidências.
- **Detalhes Técnicos**: Parâmetros radiográficos (kVp, mAs, tamanho do chassi) e critérios de avaliação para cada incidência.
- **Mídias**: Suporte para ilustrações de posicionamento e imagens de raio-X.
- **Autenticação e Segurança**: Sistema de login com JWT e gerenciamento de chaves de API (API Keys).
- **Sincronização**: Endpoint dedicado para sincronização de dados.

## 🛠️ Pré-requisitos

- **Node.js**: Versão 24.x ou superior.
- **pnpm**: Versão 10.x ou superior.
- **PostgreSQL**: Instância ativa do banco de dados.

## ⚙️ Instalação e Configuração

1.  **Clone o repositório**:
    ```bash
    git clone <url-do-repositorio>
    cd radiopos-api
    ```

2.  **Instale as dependências**:
    ```bash
    pnpm install
    ```

3.  **Configure as variáveis de ambiente**:
    Crie um arquivo `.env` na raiz do projeto com base nas seguintes variáveis:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/radiopos"
    JWT_SECRET="sua_chave_secreta_com_pelo_menos_32_caracteres"
    JWT_EXPIRY="15m"
    JWT_REFRESH_EXPIRY="7d"
    PORT=4000
    NODE_ENV="development"
    ```

4.  **Prepare o Banco de Dados**:
    Você pode subir o banco de dados PostgreSQL usando o Docker Compose:
    ```bash
    docker compose up -d
    ```
    
    Em seguida, gere o cliente do Prisma e sincronize o esquema com o banco:
    ```bash
    pnpm exec prisma generate
    pnpm exec prisma db push
    ```

## 🏃 Executando o Projeto

### Modo de Desenvolvimento
Para rodar a aplicação com recarregamento automático (hot-reload):
```bash
pnpm run dev
```

### Build para Produção
Para compilar o projeto para JavaScript:
```bash
pnpm run build
```

## 📖 Documentação da API

Após iniciar o servidor, a documentação interativa da API (Scalar) estará disponível em:
`http://localhost:4000/docs`

O esquema OpenAPI (Swagger) pode ser acessado em:
`http://localhost:4000/swagger.json`

## 📂 Estrutura de Pastas

```text
src/
├── errors/      # Tratamento de erros personalizados
├── generated/   # Código gerado pelo Prisma
├── lib/         # Configurações de bibliotecas (db, auth, env)
├── routes/      # Definição das rotas da API
├── schemas/     # Validações Zod (esquemas de entrada/saída)
└── usecases/    # Regras de negócio da aplicação
```

## 📄 Licença

Este projeto está sob a licença [ISC](LICENSE).
