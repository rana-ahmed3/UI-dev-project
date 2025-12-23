# 🍽️ Recipe Management Web App

A React-based recipe management application developed as part of **SW 302 – User Interface Development** course.

The project demonstrates modern frontend development concepts including component-based architecture, API integration, CRUD operations, form validation, and automated testing.

---

## 📌 Project Features

### 🔹 Core Functionality
- View a list of recipes
- View recipe details
- Add a new recipe
- Delete an existing recipe
- Responsive UI with reusable components

---

## 🔹 CRUD Operations (Frontend)
The application implements full **CRUD operations** using a mock API:
- **Create**: Add new recipes through a validated form
- **Read**: Fetch and display recipes from the API
- **Delete**: Remove recipes with confirmation and toast feedback  
*(Update can be easily extended if required)*

---

## 🔹 API Integration (Mock API)
- Uses **JSON Server** as a mock backend
- Recipes are stored in `db.json`
- API endpoints:
  - `GET /recipes`
  - `POST /recipes`
  - `DELETE /recipes/:id`

### ▶️ Run Mock API
```bash
npx json-server --watch db.json --port 3001
▶️ Run Mock API
npx json-server --watch db.json --port 3001

🧾 Form Validation & Error Handling

Client-side validation for Add Recipe form

Required fields are checked before submission

Error messages shown clearly to the user

API failures handled with toast notifications

Toast messages auto-dismiss after a short duration

🎨 UI Enhancements & Fixes

Removed duplicate footer on Home page

Improved delete recipe behavior across pages

UI updates immediately after successful delete

Clean and consistent user feedback

🧪 Testing Coverage

Automated unit testing implemented to satisfy testing requirements.

Tools Used

Jest

React Testing Library

Tested Scenarios

Button click actions

Form input validation

Rendering API-based data

▶️ Run Tests
npm test

🛠️ Technologies Used

React

React Router

Vite

JavaScript (ES6+)

JSON Server (Mock API)

Jest & React Testing Library

CSS

▶️ Run the Project Locally

1️⃣ Install dependencies:

npm install


2️⃣ Start the mock API:

npx json-server --watch db.json --port 3001


3️⃣ Run the frontend:

npm run dev

📂 Project Structure (Simplified)
src/
 ├─ components/
 │   ├─ common/
 │   └─ RecipeCard.jsx
 ├─ pages/
 │   ├─ Home.jsx
 │   ├─ Recipes.jsx
 │   ├─ RecipeDetails.jsx
 │   └─ AddRecipe.jsx
 ├─ App.jsx
 └─ setupTests.js
db.json

👩‍💻 Author

Arwa
SW 302 – User Interface Development
Faculty of Engineering

✅ Notes

Mock API is used to meet API integration requirements

Original UI structure and design were preserved

Project meets grading criteria for CRUD, API usage, validation, and testing
