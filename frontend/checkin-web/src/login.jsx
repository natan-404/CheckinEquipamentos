import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");

    const navigate = useNavigate();

    function fazerLogin(event) {
        event.preventDefault();

        if (
            usuario === "admin" &&
            senha === "123456"
        ) {
            localStorage.setItem("adminLogado", "true");

            navigate("/admin");
        } else {
            setErro("Usuário ou senha inválidos.");
        }
    }

    return (
        <div
            style={{
                maxWidth: "400px",
                margin: "80px auto"
            }}
        >
            <h1>Login Administrativo</h1>

            <form onSubmit={fazerLogin}>
                <p>
                    <label>Usuário</label>
                    <br />
                    <input
                        value={usuario}
                        onChange={(e) =>
                            setUsuario(e.target.value)
                        }
                        required
                    />
                </p>

                <p>
                    <label>Senha</label>
                    <br />
                    <input
                        type="password"
                        value={senha}
                        onChange={(e) =>
                            setSenha(e.target.value)
                        }
                        required
                    />
                </p>

                <button type="submit">
                    Entrar
                </button>
            </form>

            <p style={{ color: "red" }}>
                {erro}
            </p>
        </div>
    );
}

export default Login;