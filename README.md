# Caminho das Paróquias

### Videos

- [O que é Next.js, na prática, em 15 minutos!](https://www.youtube.com/watch?v=QsSUbuYeEFk)
- [Aprenda em 13:37: TypeScript](https://www.youtube.com/watch?v=cZpNkXb4Ge0)

## Estrutura do Projeto

### Diretórios Principais

#### `src/`

Contém todo o código-fonte da aplicação, incluindo frontend e backend.

- `components/` - Contém os componentes reutilizáveis que são relevantes para as rotas do frontend.

#### `src/app/`

Contém o código do frontend desenvolvido com **React e Next.js**.

- `(public)/` – Diretório para todas as rotas públicas da aplicação (acessíveis sem autenticação).
- `(private)/` – Diretório para todas as rotas privadas (acessíveis apenas por usuários autenticados).

#### `src/server/`

Contém o código do backend.

- `db/` – Diretório responsável pela configuração do banco de dados, incluindo:

  - Definição das tabelas e schemas do banco de dados.
  - Configuração da conexão com o banco.

- `modules/` – Diretório que agrupa os diferentes módulos do sistema. Cada módulo representa uma funcionalidade específica, como autenticação de usuários, gerenciamento de paróquias, etc.

  - `models/` – Contém os tipos e modelos de dados utilizados dentro do módulo específico. Aqui ficam os schemas das entidades do sistema.
  - `data_access/` – Responsável pela comunicação com o banco de dados. Este diretório contém os repositórios e funções para manipular os dados de cada módulo.
  - `use_cases/` – Contém a lógica de negócio do módulo. Aqui ficam as regras e processos que definem como os dados devem ser manipulados antes de serem enviados para o frontend ou gravados no banco.
  - `utils/` – Contém utilitários relevantes para o módulo.
  - `errors/` – Contém erros customizados para o módulo.

- `api/` – Configura o **tRPC** e define as rotas da aplicação.

### Banco de Dados

O projeto pode utilizar dois métodos principais para a configuração do banco de dados:

#### Opção 1: Usando Docker

1. Instale o **Docker** em sua máquina (https://docs.docker.com/engine/install/).
2. No terminal, execute o comando:
   ```sh
   ./start-database.sh
   ```
   Isso iniciará o banco de dados em um contêiner Docker.

#### Opção 2: Usando Neon

1. Crie uma conta no serviço **Neon** acessando [neon.tech](https://neon.tech/).
2. Dentro da plataforma, crie um novo projeto.
3. Copie a **URL de conexão** do banco de dados gerado.
4. No arquivo `.env` do projeto, cole a URL substituindo `URL` pelo valor copiado:
   ```env
   DATABASE_URL=URL
   ```
