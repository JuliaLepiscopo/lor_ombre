# L'Or & Ombre

> _Parfums de Luxe — site institucional de uma marca de perfumes de luxo._

Aplicação fullstack com **frontend em Vite + vanilla JS** e **backend em Django**. O frontend é uma SPA multi-página com 6 páginas (coleção, sobre, contato, reservar, cadastro, entrar), estética preto + dourado e tipografia clássica.

## Stack

### Frontend
- **[Vite 8](https://vite.dev)** com múltiplos entry points (um por página)
- **HTML + JavaScript vanilla** (sem framework)
- **[Tailwind CSS](https://tailwindcss.com)** via CDN (`3.4.17`)
- **CSS custom** em [frontend/src/styles/styles.css](frontend/src/styles/styles.css) com paleta black + dourado (`#D4AF37`)
- **Fontes Google**: Cormorant Garamond + Cinzel

### Backend
- **[Django](https://www.djangoproject.com/)** — projeto `core` com app `lor`
- **SQLite** (`db.sqlite3`) para desenvolvimento

## Estrutura

```
lor_ombre/
├── frontend/
│   ├── index.html               # Coleção (home)
│   ├── vite.config.js           # entries: main, about, contact, buy, register, reservation
│   ├── package.json
│   ├── public/
│   │   └── img/                 # imagens e ícones da marca
│   └── src/
│       ├── about/index.html     # Sobre
│       ├── buy/index.html       # Entrar
│       ├── contact/index.html   # Contato
│       ├── register/index.html  # Cadastro
│       ├── reservation/index.html  # Reservar
│       ├── scripts/
│       │   ├── index.js · about.js · buy.js · register.js · reservation.js
│       │   └── google-login.js  # integração de login social
│       └── styles/
│           └── styles.css       # design system (paleta, gradientes dourados, tipografia)
├── backend/
│   ├── manage.py
│   ├── db.sqlite3
│   ├── core/                    # settings, urls, asgi, wsgi
│   └── lor/                     # app principal (models, views, admin)
└── old/                         # versão pre-Vite (HTML files no root) — referência
```

## Páginas

| Rota                          | Conteúdo                                    |
| ----------------------------- | ------------------------------------------- |
| `/`                           | Coleção — hero e vitrine dos perfumes       |
| `/src/about/`                 | Sobre — história da marca                   |
| `/src/contact/`               | Contato                                     |
| `/src/buy/`                   | Entrar (login)                              |
| `/src/register/`              | Cadastro de novo usuário                    |
| `/src/reservation/`           | Reserva de produto / experiência            |

## Design

- **Paleta**: preto (`#0d0d0d`, `#1a1a1a`) + dourado (`#D4AF37`, `#f4e4ba`) com gradientes em headlines e botões
- **Tipografia**: `Cinzel` para títulos e labels institucionais, `Cormorant Garamond` para textos
- **Componentes utilitários** em [styles.css](frontend/src/styles/styles.css): `.luxury-bg`, `.gold-text`, `.gold-gradient`, `.card-luxury`, `.btn-luxury`

## Como rodar

### Frontend

```bash
cd frontend
npm install
npm run dev        # serve em localhost (porta padrão do Vite)
```

Outros comandos:
```bash
npm run build      # build de produção em dist/
npm run preview    # serve o build localmente
```

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install django
python manage.py migrate
python manage.py runserver     # http://localhost:8000
```

## Convenções

- Cada página tem seu próprio diretório em `frontend/src/<pagina>/index.html` + script correspondente em `frontend/src/scripts/<pagina>.js`
- Imagens e ícones ficam em `frontend/public/img/` e são referenciados como `/img/...`
- Todo entry point novo precisa ser registrado em [vite.config.js](frontend/vite.config.js)
- A pasta `old/` é apenas referência da versão anterior — não modificar
