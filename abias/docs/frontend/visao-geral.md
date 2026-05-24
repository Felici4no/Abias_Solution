---
sidebar_position: 1
title: Visão Geral
---

# Front-end — Visão Geral

O front-end da Abias é um **Progressive Web App (PWA)** construído com **React + Vite**, localizado em `mobile/`. O nome da pasta diz tudo sobre a intenção: o produto foi projetado do início para o uso em celular, por trabalhadores que operam com o telefone na mão.

Para fins de apresentação em desktop, o app é renderizado dentro de um frame que simula a tela de um smartphone — notch, cantos arredondados e botões laterais incluídos. Mas a aplicação é totalmente funcional em qualquer dispositivo móvel real.

---

## Estrutura de pastas

```
mobile/src/
├── main.jsx                          # Entry point React
├── App.jsx                           # Raiz da aplicação: decide o que renderizar
├── controllers/
│   └── useAppController.js           # Hook central com todo o estado e todos os handlers
├── models/
│   ├── api.js                        # Função apiFetch — único ponto de comunicação com a API
│   └── cicloHelper.js                # Sincronização do estado do ciclo com o React state
└── views/
    ├── components/
    │   ├── BottomNav.jsx             # Barra de navegação inferior com 5 abas
    │   └── AreaOperacional.jsx       # Painel deslizante com dados operacionais do iFood
    └── screens/
        ├── LoginScreen.jsx           # Tela de login e seleção de perfil
        ├── OnboardingScreen.jsx      # Splash e formulário de cadastro de membro
        ├── HomeScreen.jsx            # Dashboard principal (aba Início)
        ├── ReputacaoScreen.jsx       # Reputação e score comunitário (aba Reputação)
        ├── CreditoScreen.jsx         # Solicitação e acompanhamento de crédito (aba Crédito)
        ├── RedeScreen.jsx            # Rede de pares e avais (aba Rede)
        ├── PerfilScreen.jsx          # Perfil do membro (aba Perfil)
        ├── OficinaScreen.jsx         # Visão exclusiva da oficina parceira
        └── GestaoScreen.jsx          # Painel de gestão e administração
```

---

## Padrão arquitetural

O front-end segue o padrão **MVC adaptado para React**. A escolha desse padrão foi deliberada: ele separa claramente o que é dado, o que é lógica, e o que é apresentação — tornando o código mais fácil de entender, testar e modificar.

| Camada | Arquivo | Responsabilidade |
|--------|---------|-----------------|
| **Model** | `models/api.js`, `models/cicloHelper.js` | Comunicação com a API e transformação de dados |
| **Controller** | `controllers/useAppController.js` | Todo o estado global e todos os handlers de ação |
| **View** | `views/` | Apenas renderização; recebe o controller como prop `ctrl` |

A regra é simples e rígida: as telas não gerenciam estado próprio e não fazem chamadas à API diretamente. Tudo passa pelo controller. Isso significa que qualquer tela pode ser lida e entendida sem precisar entender a lógica de negócio — ela apenas exibe o que o controller fornece e chama os handlers que o controller expõe.

---

## Como o App.jsx decide o que renderizar

`App.jsx` é o orquestrador visual da aplicação. Ele lê o estado do controller e decide qual tela mostrar:

```
loginRole ausente
  └─► LoginScreen

loginRole presente + loading
  └─► spinner "Carregando jornada..."

loginRole = 'oficina'
  └─► OficinaScreen

loginRole = 'gestao'
  └─► GestaoScreen

loginRole = 'membro' + sem membroId
  └─► OnboardingScreen (cadastro)

loginRole = 'membro' + com membroId
  └─► Header ABIAS + tela ativa (conforme activeTab) + BottomNav
```

O header exibido para membros autenticados mostra o logo "ABI|AS", um badge com o role do usuário, o botão de notificações (que abre o painel de dados operacionais) e o botão de logout.

---

## Comunicação com o back-end

Toda comunicação com a API passa por uma única função: `apiFetch`, definida em `models/api.js`.

```js
// GET simples
apiFetch('/abias/membros/123')

// POST com body
apiFetch('/abias/ciclos', { method: 'POST', body: { valor: 850, finalidade: 'Troca de pneu' } })
```

A função serializa o body para JSON, define o header `Content-Type: application/json`, e lança um erro se o status HTTP for diferente de 2xx. Erros de API são propagados com a mensagem retornada pelo servidor ou com o status HTTP como fallback.

Em desenvolvimento, o Vite está configurado para fazer proxy de `/api/*` para `http://localhost:3000`, de modo que o front-end nunca precisa conhecer o endereço real da API.

---

## Navegação

A navegação entre telas não usa React Router. Em vez disso, o estado `activeTab` no controller controla qual tela está visível. O `BottomNav` exibe as 5 abas e, ao clicar, chama `setActiveTab(tabId)` no controller.

| Tab ID | Tela | Perfil |
|--------|------|--------|
| `inicio` | HomeScreen | Membro |
| `reputacao` | ReputacaoScreen | Membro |
| `credito` | CreditoScreen | Membro |
| `rede` | RedeScreen | Membro |
| `perfil` | PerfilScreen | Membro |

Oficina e Gestão não têm BottomNav — cada um desses perfis tem uma única tela dedicada, acessada diretamente após o login.

---

## Persistência local

O app usa `localStorage` para manter o estado entre sessões. Os dados persistidos são:

| Chave | Conteúdo |
|-------|----------|
| `abias_login_role` | Role do usuário autenticado (`membro`, `oficina`, `gestao`) |
| `abias_usuario` | Objeto JSON com dados do usuário (id, nome, email, membro_id) |
| `abias_membro_id` | UUID do membro ativo |
| `abias_ciclo_id` | UUID do ciclo ativo |

Na inicialização do hook, se `abias_membro_id` estiver presente, o app carrega automaticamente os dados do membro, o ciclo ativo e o saldo do fundo em paralelo. Se alguma chamada falhar, o localStorage é limpo e o app retorna para a tela inicial — evitando estados inconsistentes.
