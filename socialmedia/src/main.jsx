/*React App
│
├── StrictMode
│   └── ReactQuery Provider (handles data fetching)
│       └── Auth Provider (manages logged-in user state)
│           └── Router (enables navigation)
│               └── App (main UI)*/

import { StrictMode } from "react"; /*StrictMode is a tool from React.It helps to detect errors or potential problems in your app during  development (won’t affect production).Helps you write better, safer code.*/

import { createRoot } from "react-dom/client"; /*This creates the React app root — the top-level element where your entire React app will be inserted.createRoot is part of the React 18 way of rendering apps. */

import "./index.css"; /* You're importing a global CSS file to style your entire app.*/

import App from "./App.jsx"; /*This imports your main App component (where all your routes and UI start).*/

import { BrowserRouter as Router } from "react-router"; /* This sets up client-side routing (switching pages without reloading).BrowserRouter keeps your app in sync with the browser’s URL.*/

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"; /*QueryClient handles caching, fetching, and syncing server state.QueryClientProvider gives all your components access to React Query.*/

import { AuthProvider } from "./context/AuthContext.jsx"; /*This is your custom authentication context.It likely helps manage whether the user is logged in or not throughout the app. */

const client =
  new QueryClient(); /*Creating an instance of React Query Client to handle data fetching globally.*/

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <AuthProvider>
        <Router>
          <App />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
