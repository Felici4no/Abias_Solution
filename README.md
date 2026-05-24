# Abias - Crédito para seu corre

<div align="center">
  <a href="https://loquacious-biscochitos-529d3b.netlify.app/">
    <img src="https://res.cloudinary.com/dhlzexsce/image/upload/v1779632466/abiaslogo_xwwc9v.png" style="border-radius: 10%; width: 150px;" alt="Abias - Logotipo"/><br>
    <sub><b>Abias - Crédito para seu corre</b></sub>
  </a>
</div>

## Integrantes

<div align="center">
  <table>
    <tr>
      <td align="center">
        <a href="https://www.linkedin.com/in/kaian-moura-56b8871b4/">
          <sub><b>Kaian Santos Moura</b></sub>
        </a>
      </td>
      <td align="center">
        <a href="https://www.linkedin.com/in/eduardo-jesus-/">
          <sub><b>Eduardo Jesus Tavares Sant'Anna</b></sub>
        </a>
      </td>
      <td align="center">
        <a href="https://www.linkedin.com/in/lucas-feliciano-software/">
          <sub><b>Lucas Feliciano</b></sub>
        </a>
      </td>
      <td align="center">
        <a href="https://www.linkedin.com/in/kaylan-alexandre/">
          <sub><b>Kaylan Alexandre Sathler</b></sub>
        </a>
      </td>
      <td align="center">
        <a href="https://www.linkedin.com/in/maria-vit%C3%B3ria-dos-santos/">
          <sub><b>Maria Vitória dos Santos</b></sub>
        </a>
      </td>
    </tr>
  </table>
</div>

## 📝 Descrição

A Abias é uma plataforma financeira desenvolvida para entregadores de aplicativos, como iFood e 99. Nosso objetivo é criar uma infraestrutura de crédito justa, baseada no comportamento operacional do trabalhador em vez de modelos de score tradicionais.

A solução funciona da seguinte forma:

1. **Cadastro e Análise de Dados**: O entregador conecta suas contas dos aplicativos de entrega, permitindo que nossa plataforma acesse dados como frequência de corridas, ganhos, avaliações e tempo de atividade.

2. **Score de Crédito Dinâmico**: Uma Inteligência Artificial processa esses dados para gerar um score operacional dinâmico, que reflete a estabilidade e previsibilidade de renda do profissional.

3. **Produtos Financeiros Personalizados**: Com base no score, oferecemos:
   - **Cartão de Crédito**: Com limite dinâmico que se ajusta ao desempenho do entregador. A monetização ocorre via taxas de `interchange`.
   - **Empréstimos Pessoais**: Liberados com base no comportamento operacional, oferecendo uma alternativa ao sistema bancário tradicional.

4. **Cashback Comunitário**: Incentivamos a economia local com um sistema de cashback. Ao usar o cartão em estabelecimentos parceiros, o entregador recebe um desconto na fatura, fortalecendo o comércio da sua comunidade.

O diferencial da Abias é transformar o comportamento operacional em confiança financeira, oferecendo acesso a capital que, de outra forma, seria negado a esses profissionais.

## 💻 Como rodar a aplicação

### Pré-requisitos

- [Node.js](https://nodejs.org/) v20 ou superior
- Banco PostgreSQL acessível (ou use a string de conexão Neon já configurada no `.env`)

### 1. Clone o repositório

```bash
git clone https://github.com/theblackmoney/abias-app.git
cd abias-app/theblackmoney
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz de `theblackmoney/` com:

```env
DATABASE_URL=postgresql://...        # string de conexão PostgreSQL
GROQ_API_KEY=gsk_...                 # chave da API Groq (IA de análise de crédito)
GEMINI_API_KEY=...                   # opcional — fallback da IA
```

### 3. Rode o back-end (API)

```bash
cd apps/api
npm install
node src/server.js
```

A API ficará disponível em `http://localhost:3000`.

Para rodar as migrations do banco na primeira execução:

```bash
node src/database/runMigrations.js
```

### 4. Rode o front-end (PWA mobile)

Em outro terminal:

```bash
cd mobile
npm install
npm run dev
```

O app ficará disponível em `http://localhost:5173`.

> O Vite já está configurado para fazer proxy de `/api` → `http://localhost:3000`, então back e front funcionam juntos sem configuração extra.

### 5. (Opcional) Rode a documentação localmente

```bash
cd abias
npm install
npm run start
```

A documentação ficará disponível em `http://localhost:3000` (porta diferente da API — suba um dos dois com porta alternativa se necessário).

---

## 🚀 Acesso e Download

Acesse a documentação completa do projeto, feita com Docusaurus, através do link abaixo:

- 🔗 [**Documentação do Projeto**](https://abias-sigma.vercel.app)

Para testar o aplicativo em um dispositivo Android, realize o download do arquivo `.apk` pelo Google Drive:

- 📱 [**Baixar APK (v1.0.0)**](https://drive.google.com/drive/folders/1K65Ex8_zP6IK49BFd9cUDenJw1rwTiKE?usp=drive_link)

## 📋 Licença/License

<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;"
     src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1">
<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;"
     src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1">

<p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/">
  <a property="dct:title" rel="cc:attributionURL" href="https://github.com/theblackmoney/abias-app">Abias</a>
  by Inteli — desenvolvido por
  <span property="cc:attributionName">
    <a href="https://www.linkedin.com/in/kaian-moura-56b8871b4/">Kaian Santos Moura</a>,
    <a href="https://www.linkedin.com/in/eduardo-jesus-/">Eduardo Jesus Tavares Sant'Anna</a>,
    <a href="https://www.linkedin.com/in/lucas-feliciano-software/">Lucas Feliciano</a>,
    <a href="https://www.linkedin.com/in/kaylan-alexandre/">Kaylan Alexandre Sathler</a> e
    <a href="https://www.linkedin.com/in/maria-vit%C3%B3ria-dos-santos/">Maria Vitória dos Santos</a>
  </span>
  — está licenciado sob
  <a href="http://creativecommons.org/licenses/by/4.0/?ref=chooser-v1"
     target="_blank" rel="license noopener noreferrer" style="display:inline-block;">
    CC Attribution 4.0 International
  </a>.
</p>
