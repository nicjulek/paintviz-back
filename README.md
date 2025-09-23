<div align="center">
  <h1 align="center">🎨 PaintViz 🚚</h1>
  <strong>Sistema para visualização e personalização de pinturas em carretas de caminhão.</strong>
</div>
<br>

## Sobre o Projeto
O **PaintViz** é um sistema desenvolvido para a fábrica de carrocerias **Carga Pesada**, com o objetivo de modernizar o processo de personalização de pinturas. A plataforma oferece uma solução digital e interativa para que os clientes possam escolher, visualizar e aprovar o design da pintura de suas carretas antes do início da produção, visando a redução de erros, custos e retrabalho.

## Equipe de Desenvolvimento

| Nome                      | Função        |
| ------------------------- | ------------- |
| Flávia Marcela Siqueira   | Desenvolvedora |
| Maria Luiza Fica Borges   | Desenvolvedora |
| Nicole Julek Klazura      | Desenvolvedora |

## Tecnologias Utilizadas

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Knex.js](https://img.shields.io/badge/Knex.js-E16426?style=for-the-badge&logo=knex.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)


## Pré-requisitos

- **Node.js**
- **MySQL**
- **NPM** 

## Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/nicjulek/paintviz-back.git
cd paintviz-back
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Renomeie o arquivo .env.template na raiz do projeto para .env
```bash
# Configurações do Banco de Dados
DB_HOST=localhost
DB_PORT=3306
DB_USER=seu_user_aqui
DB_PASSWORD=sua_senha_aqui
DB_NAME=paintviz

# Configurações da Aplicação
NODE_ENV=development
PORT=3333
```

### 4. Configure o banco de dados MySQL

#### Crie o banco de dados:
```sql
CREATE DATABASE paintviz CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### Execute as migrations:
```bash
npx knex migrate:latest
```

#### Insira um administrador:
```bash
INSERT INTO Usuario (nome, senha) VALUES ('admin', '$2b$10$32pRscUXoIBIprLt9OYlx.WhVW309qhLr17tyz8P/cCy8nSi5euuu');
INSERT INTO Administrador (id_usuario) VALUES (1);
```
Para login no sistema
- Usuario: admin
- Senha: 123abc

#### Insira os status:
```bash
INSERT INTO Status (descricao, data_definicao_status)
VALUES 
    ('Pré-Ordem', CURDATE()),
    ('Aberta', CURDATE()),
    ('Em produção', CURDATE()),
    ('Finalizada', CURDATE()),
    ('Cancelada', CURDATE());
```

## Como executar

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

O servidor estará rodando em: `http://localhost:PORT`
