import React from "react";
import ReactDOM from "react-dom/client";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import App from "./App";
import Admin from "./Admin";
import Login from "./login";

import "./index.css";

function RotaProtegida({ children }) {
    const logado =
        localStorage.getItem("adminLogado") === "true";

    return logado
        ? children
        : <Navigate to="/login" />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<App />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/admin"
                    element={
                        <RotaProtegida>
                            <Admin />
                        </RotaProtegida>
                    }
                />
            </Routes>
        </BrowserRouter>
);