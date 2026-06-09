# GEMINI.md — Calculadora da Feira

<meta>
  <critical>This file inherits ALL rules from the root GEMINI.md at
  `c:\Users\paulo\workspace\experimentos\GEMINI.md`.
  Root rules are non-negotiable. This file adds experiment-specific
  context only.</critical>
</meta>

> **Parent**: [Root GEMINI.md](../GEMINI.md)  
> **Global Changelog**: [GLOBAL.md](../GLOBAL.md)  

---

## Experiment Identity

| Field | Value |
|---|---|
| **Name** | Calculadora da Feira |
| **Codename** | `calculadora-feira` |
| **Status** | 🔨 In Progress |
| **Stack** | HTML + CSS + JS (Vanilla PWA) |
| **Target User** | Non-technical person (developer's mother) |
| **Goal** | Replace manual paper calculations for weekly market shopping |

## Problem Statement

Every Monday and Thursday, the user's mother manually calculates produce prices on paper — multiplying weight × price per kg × markup percentage. This app automates that calculation with a clean, accessible mobile interface.

## Core Features

1. **Add items**: Name + Price/KG + Quantity (KG)
2. **Global markup %**: Configurable (default 40%)
3. **Auto calculation**: `price_per_kg × quantity × (1 + markup/100)`
4. **Real-time total**: Sum of all items
5. **History**: Last lists saved in localStorage
6. **Search/filter**: Filter items by name
7. **PWA**: Installable on phone, works offline

## Technical Decisions

- **No framework** — Vanilla HTML/CSS/JS. A calculator doesn't need React.
- **localStorage** — No backend. Data lives on the device.
- **Service Worker** — Offline capability for use at the market.
- **Mobile-first** — Designed for phone use, large touch targets.
