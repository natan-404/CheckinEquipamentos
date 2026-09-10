import { useState } from "react";

function App() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [departamento, setDepartamento] = useState("");
    const [status, setStatus] = useState("");

    function gerarConfig() {
    const config = {
        nome,
        email,
        departamento
    };

    const blob = new Blob(
        [JSON.stringify(config)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "config.json";
    a.click();

    URL.revokeObjectURL(url);
}

    async function enviarCheckin(event) {
    event.preventDefault();

    try {
        const response = await fetch(
  "http://192.168.1.238:5011/api/checkin/usuario",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome,
                    email,
                    departamento
                })
            }
        );

        if (!response.ok) {
            throw new Error();
        }

        setStatus(
            "✅ Usuário cadastrado. Agora baixe a configuração e o agente."
        );
    }
    catch {
        setStatus("❌ Erro ao salvar usuário.");
    }
}

    function gerarConfig() {
    const config = {
        Nome: localStorage.getItem("nome"),
        Email: localStorage.getItem("email"),
        Departamento: localStorage.getItem("departamento")
    };

    const blob = new Blob(
        [JSON.stringify(config, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "config.json";

    a.click();

    URL.revokeObjectURL(url);
}

    return (
        <div
            style={{
                maxWidth: "500px",
                margin: "50px auto",
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "10px"
            }}
        >
            <h1>Check-in de Equipamentos</h1>

            <form onSubmit={enviarCheckin}>
                <p>
                    <label>Nome</label>
                    <br />
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </p>

                <p>
                    <label>Email</label>
                    <br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </p>

                <p>
                    <label>Departamento</label>
                    <br />
                    <input
                        type="text"
                        value={departamento}
                        onChange={(e) => setDepartamento(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </p>

                <button
                    type="submit"
                    style={{
                        padding: "10px 20px",
                        cursor: "pointer"
                    }}
                >
                    Realizar Check-in
                </button>
            </form>

            {status && (
    <div style={{ marginTop: "20px" }}>
        <p>
            <strong>{status}</strong>
        </p>

        <button
    onClick={gerarConfig}
    style={{
        display: "inline-block",
        marginTop: "10px",
        padding: "10px 20px",
        background: "#16a34a",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
    }}
>
    📥 Baixar Configuração
</button>
            📥 Baixar Agente
        
         <a
  href="/downloads/CheckinAgent.exe"
  target="_blank"
  rel="noreferrer"
  style={{
    display: "inline-block",
    marginLeft: "10px",
    padding: "10px 20px",
    background: "#2563eb",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "6px"
  }}
>
  📥 Baixar Agente
</a>

    </div>
)}
        </div>
    );
}

export default App;