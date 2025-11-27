# 🍲 Recipe Website  

A **full-stack** web application for discovering, sharing, and managing recipes.  
Built with a **Node.js/Express** backend and a **Vue 3** frontend, the app offers authentication, recipe browsing (local DB + Spoonacular API), favorites management, and personal recipe creation.  

---

## 📌 Features  

- **User Authentication** – Register, log in, and log out with secure session-based authentication  
- **Recipe Browsing** – Search, filter, and sort recipes from the local DB or the Spoonacular API  
- **Favorites & History** – Save favorite recipes and view recently accessed dishes  
- **Personal & Family Recipes** – Add your own recipes and explore curated family recipes  
- **Profile Management** – View and update your personal information  
- **Docker Support** – Backend includes a Dockerfile for easy containerized deployment  

---

## 🛠 Tech Stack  

| Layer      | Technologies |
|------------|-------------|
| **Frontend** | Vue 3, Vue Router, Axios, Bootstrap 5, Vuelidate |
| **Backend**  | Node.js, Express, bcryptjs, session cookies, PostgreSQL (mysql2, pg), Spoonacular API |
| **Tooling**  | npm, Vue CLI, ESLint |

---

## 📂 Project Structure  

```
Recipe-Website/
├── backend/     # Express API, database access, authentication, Dockerfile
├── frontend/    # Vue 3 SPA for recipe browsing and user interaction
└── README.md    # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites  
- Node.js ≥ 16 & npm ≥ 8  
- A running MySQL or PostgreSQL database  
- (Optional) Docker for backend deployment  

---

### Installation & Development  

#### Backend  
```bash
cd backend
npm install
npm start  # Runs on http://localhost:3000
```

#### Frontend  
```bash
cd frontend
npm install
npm run serve  # Runs on http://localhost:8080
```

---

### Production Build (Frontend)  
```bash
npm run build
```

---

### Backend with Docker
```bash
cd backend
docker build -t recipe-api .
docker run -p 3000:3000 recipe-api
```

---

## 🌐 Deployment

The repository includes a GitHub Actions workflow that builds the Vue frontend and deploys it to **GitHub Pages** whenever changes are pushed to the `main` branch or the workflow is manually dispatched.

### How it works
1. **Build** – Installs frontend dependencies with `npm ci` and runs `npm run build`.
2. **Publish** – Uploads the contents of `frontend/dist` as a Pages artifact and deploys it using `actions/deploy-pages`.

### Enabling Pages
1. Open **Settings → Pages** in your GitHub repository.
2. Set **Source** to **GitHub Actions**.
3. Trigger a push to `main` (or use the **Run workflow** button) to publish the latest build.

---

## 📡 API Overview  

### **Auth**  
- `POST /auth/register` – Create a new user  
- `POST /auth/login` – Authenticate user and start session  
- `POST /auth/logout` – Destroy session  

### **Recipes**  
- `GET /recipes` – List recipes with optional filters  
- `GET /recipes/random` – Get random recipes  
- `GET /recipes/viewed` – Recently viewed recipes  
- `GET /recipes/myRecipes` – User’s personal recipes  
- `POST /recipes` – Create a new recipe (auth required)  

### **Users**  
- `GET /users` – List users (admin only)  
- `GET /user/favorites` – Get favorite recipes  
- `POST /user/favorites` – Add recipe to favorites  
- `GET /user/me` – Get logged-in user profile  
- `PUT /user/me` – Update user profile  

---

## 🎨 Frontend Overview  
- Authentication pages (register/login/logout)  
- Recipe search, filtering, and sorting  
- Display of random and family recipes  
- Favorites & personal recipe management  
- Responsive design with Bootstrap 5  

---

## 🔑 Environment Variables  

Backend `.env` example:  
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=recipes
BCRYPT_SALT_ROUNDS=10
SPOONACULAR_API_KEY=your_api_key
```





---

## 📜 License  
This project currently has no license. Please add one before production use.  

---

## 👨‍💻 Authors  
- **Rom Sheynis** 
- **Lioz Shor**  

---
