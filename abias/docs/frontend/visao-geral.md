---
sidebar_position: 1
title: Visão Geral
---

# Front-end — Visão Geral

O front-end da Abias é um **Progressive Web App (PWA)** construído com **React + Vite**, localizado em `theblackmoney/mobile/`. A UI simula uma tela de smartphone dentro de um frame de celular (para apresentação em desktop), mas é responsiva para uso real em mobile.

## Estrutura de pastas

```
mobile/src/
├── main.jsx                          # Entry point React
├── App.jsx                           # Raiz da aplicação: roteamento entre telas
├── controllers/
│   └── useAppController.js           # Hook central: todo estado e handlers da aplicação
├── models/
│   ├── api.js                        # Cliente HTTP (apiFetch)
│   └── cicloHelper.js                # Sincronização de estado do ciclo com o React state
└── views/
    ├── components/
    │   ├── BottomNav.jsx             # Barra de navegação inferior com 5 abas
    │   └── AreaOperacional.jsx       # Painel lateral com dados operacionais iFood
    └── screens/
        ├── LoginScreen.jsx           # Tela de login / seleção de perfil
        ├── OnboardingScreen.jsx      # Telas de onboarding e cadastro de membro
        ├── HomeScreen.jsx            # Dashboard principal (aba Início)
        ├── ReputacaoScreen.jsx       # Reputação e score comunitário (aba Reputação)
        ├── CreditoScreen.jsx         # Solicitação e acompanhamento de crédito (aba Crédito)
        ├── RedeScreen.jsx            # Rede de pares e avais (aba Rede)
        ├── PerfilScreen.jsx          # Perfil do membro (aba Perfil)
        ├── OficinaScreen.jsx         # Visão da oficina parceira
        └── GestaoScreen.jsx          # Painel de gestão / administração
```

## Padrão arquitetural

O front-end segue o padrão **MVC adaptado para React**:

| Camada | Responsabilidade |
|--------|-----------------|
| **Model** (`models/`) | Comunicação com a API (`apiFetch`) e transformações de dados (`cicloHelper`) |
| **Controller** (`useAppController.js`) | Todo o estado global e handlers de ação; retorna props para as views |
| **View** (`views/`) | Apenas renderização; recebe `ctrl` (resultado do controller) como prop |

## Como o App.jsx decide o que renderizar

```
loginRole ausente  →  LoginScreen
loginRole presente + loading  →  spinner
loginRole = 'oficina'  →  OficinaScreen
loginRole = 'gestao'  →  GestaoScreen
loginRole = 'membro'  →  Onboarding (se sem membroId) ou app completo com BottomNav
```

## Comunicação com o back-end

Toda comunicação passa pela função `apiFetch` em `models/api.js`:

```js
apiFetch('/abias/membros/123')           // GET
apiFetch('/abias/ciclos', { method: 'POST', body: { ... } })
```

Em desenvolvimento, o Vite faz proxy de `/api` para o servidor Node.js local.

## Navegação

A navegação entre telas usa o estado `activeTab` do controller (sem React Router). As 5 abas são:

| Tab ID | Tela | Ícone |
|--------|------|-------|
| `inicio` | HomeScreen | casa |
| `reputacao` | ReputacaoScreen | estrela |
| `credito` | CreditoScreen | moeda |
| `rede` | RedeScreen | pessoas |
| `perfil` | PerfilScreen | usuário |
