# 🐣 Pet Virtual de Programação

Um aplicativo web interativo onde você cuida de um pet virtual que evolui conforme você programa!  
Registre suas sessões de estudo, alimente, brinque e veja seu pet crescer com você. 🧠💻

![screenshot](https://via.placeholder.com/600x300.png?text=Prévia+do+App) 

---

## 🚀 Funcionalidades

- 👨‍💻 Registrar sessões de programação (com tempo, linguagem e data)
- 🥗 Alimentar e brincar com o pet para manter energia e felicidade
- 🧠 Evoluir de nível conforme acumula experiência
- 🏆 Receber um emoji especial ao alcançar o nível 7+
- 📅 Contador de dias seguidos programando
- 💾 Salvamento automático no navegador (localStorage)
- 📱 Responsivo e acessível em dispositivos móveis

---

## 🛠 Tecnologias Utilizadas

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/) – ambiente de build rápido
- HTML5 + CSS3
- Roboto (Google Fonts)
- `localStorage` para persistência de dados

---

## 📦 Como rodar localmente

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/pet-virtual-programador.git
cd pet-virtual-programador

# 2. Instale as dependências
npm install

# 3. Rode o projeto
npm run dev
```

Acesse: [http://localhost:5173](http://localhost:5173)

---

## 📂 Estrutura do Projeto

```
src/
├── components/        # Componentes reutilizáveis
│   ├── PetStatus.jsx
│   ├── PetActions.jsx
│   └── SessionModal.jsx
├── App.jsx            # Componente principal
├── App.css            # Estilização geral + responsividade
└── main.jsx           # Entrada da aplicação
```

---

## 🎨 Personalização

Você pode:
- Trocar os emojis do pet
- Adicionar conquistas, missões diárias, gráficos de evolução
- Mudar a imagem de fundo (colocando em `img/background.jpg`)
- Ativar modo escuro com CSS

---

## 📸 Exemplo de uso

> "Registrei 2h de estudos em React e meu pet virou um 🦄!"
>  
> "Programei por 5 dias seguidos e desbloqueei um emoji secreto!"

---

## 💡 Ideias futuras

- ✅ Sistema de conquistas
- 📈 Gráficos de evolução com Recharts
- 🌙 Modo noturno
- 🔐 Login com conta (Firebase ou Supabase)
- 💾 Exportar e importar progresso
- 🌎 Deploy público (Netlify/Vercel)

---

## 📄 Licença

Este projeto é livre para fins de aprendizado e uso pessoal.  
Você pode modificá-lo e evoluir como quiser. 🚀

---

## 🤝 Contribuições

Contribuições são bem-vindas!  
Sinta-se à vontade para abrir issues ou fazer PRs. ✨

---

Feito com 🤎 por [Wil Xavier](https://github.com/wilsonxavier93)