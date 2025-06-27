# My Todo App

A modern, scalable Todo application built with React, TypeScript, and Tailwind CSS.  
This project demonstrates clean architecture using the SOLID principles, the repository pattern, and is ready for both localStorage and future API/database backends.

- [Live](https://loquacious-hotteok-e0bda7.netlify.app)

---

## ✨ Features

- Add, complete, and delete todos
- Filter by all, active, or completed
- Beautiful pastel UI with Tailwind CSS and shadcn/ui
- State management with React Context and the Repository pattern
- Easily swap data sources (localStorage, API, etc.)
- Accessible and responsive design

---

## 🛠️ Tech Stack

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query/latest) (for future API integration)
- [Axios](https://axios-http.com/) (for future API integration)

---

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   ```
   http://localhost:5173
   ```

---

## 🧩 Project Structure

```
src/
  components/         # UI components
    ui/
    common/
    Todos.tsx
    ...
  store/              # State management and repositories
    TodoContext.tsx
    TodosProvider.tsx
    Repository/
      TodoRepository.ts
      LocalTodoRepository.ts
      ApiTodoRepository.ts
  lib/                # Utilities and constants
    utils.ts
```

---

## 🧑‍💻 Extending

- To use an API or database, implement the `TodoRepository` interface and inject it into the provider.
- The UI and logic will work without changes!

---

## 🙏 Credits

Built with ❤️ by [Priyabrata Chowley](https://github.com/prchowley)  
Powered by React, TanStack Query, shadcn/ui, and Tailwind
