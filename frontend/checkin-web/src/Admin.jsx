import { useEffect, useState } from "react";
import XLSX from "xlsx-js-style";
import "./Admin.css";

function Admin() {
    const [checkins, setCheckins] = useState([]);
    const [devices, setDevices] = useState([]);
    const [relatorio, setRelatorio] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [equipamentoSelecionado, setEquipamentoSelecionado] =
        useState(null);

    const usuariosUnicos =
        new Set(relatorio.map(x => x.email)).size;

    const departamentosUnicos =
        new Set(relatorio.map(x => x.departamento)).size;

    const ultimoCheckin =
        relatorio.length > 0
            ? new Date(
                Math.max(
                    ...relatorio.map(x =>
                        new Date(x.createdAt)
                    )
                )
            ).toLocaleString("pt-BR")
            : "-";
    function sair() {
        localStorage.removeItem("adminLogado");
        window.location.href = "/login";
    }

    async function limparHistorico() {
    if (!window.confirm("Deseja apagar todo o histórico?")) {
        return;
    }

    try {
        await fetch(
            "http://localhost:5011/api/checkin/clear",
            {
                method: "DELETE"
            }
        );

        alert("Histórico apagado.");

        carregarCheckins();
        carregarRelatorio();
    }
    catch (error) {
        console.error(error);
        alert("Erro ao apagar histórico.");
    }
}

    async function exportarExcel() {
        try {
            const response = await fetch(
                "http://localhost:5011/api/checkin/report"
            );

            const dados = await response.json();

            const relatorio = dados.map(item => ({
                Nome: item.nome,
                Email: item.email,
                Departamento: item.departamento,

                Data: new Date(item.createdAt)
                    .toLocaleString("pt-BR"),

                Computador: item.computador,
                Fabricante: item.fabricante,
                Modelo: item.modelo,
                Serial: item.serial,

                CPU: item.cpu,
                RAM_GB: item.ramGb,
                GPU: item.gpu,

                Sistema: item.sistema,

                Disco: item.disco,
                TamanhoDisco_GB: item.discoGb,

                UUID: item.uuid
            }));

            const wb = XLSX.utils.book_new();

            const ws = XLSX.utils.json_to_sheet(relatorio);

            const headerStyle = {
                font: {
                    bold: true,
                    color: { rgb: "FFFFFF" },
                    sz: 12
                },
                fill: {
                    fgColor: { rgb: "1F4E78" }
                },
                alignment: {
                    horizontal: "center",
                    vertical: "center"
                }
            };

            const range = XLSX.utils.decode_range(ws["!ref"]);

            for (let col = range.s.c; col <= range.e.c; col++) {
                const cell = XLSX.utils.encode_cell({
                    r: 0,
                    c: col
                });

                if (ws[cell]) {
                    ws[cell].s = headerStyle;
                }
            }

            ws["!cols"] = [
                { wch: 25 },
                { wch: 35 },
                { wch: 20 },
                { wch: 25 },
                { wch: 25 },
                { wch: 20 },
                { wch: 25 },
                { wch: 20 },
                { wch: 45 },
                { wch: 10 },
                { wch: 30 },
                { wch: 20 },
                { wch: 25 },
                { wch: 15 },
                { wch: 40 }
            ];

            XLSX.utils.book_append_sheet(
                wb,
                ws,
                "Inventario Completo"
            );

            const dataAtual =
                new Date()
                    .toISOString()
                    .split("T")[0];

            XLSX.writeFile(
                wb,
                `Inventario_Completo_${dataAtual}.xlsx`
            );
        }
        catch (error) {
            console.error(error);

            alert("Erro ao gerar Excel.");
        }
    }

    async function carregarCheckins() {
        try {
            const response = await fetch(
                "http://localhost:5011/api/checkin/list"
            );

            const data = await response.json();

            setCheckins(data);
        } catch (error) {
            console.error(error);
        }
    }

    async function carregarDevices() {
        try {
            const response = await fetch(
                "http://localhost:5011/api/checkin/devices"
            );

            const data = await response.json();

            setDevices(data);
        } catch (error) {
            console.error(error);
        }
    }

    async function carregarRelatorio() {
        try {
            const response = await fetch(
                "http://localhost:5011/api/checkin/report"
            );

            const data = await response.json();

            setRelatorio(data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
    carregarCheckins();
    carregarDevices();
    carregarRelatorio();

    const intervalo = setInterval(() => {
        carregarCheckins();
        carregarDevices();
        carregarRelatorio();
    }, 5000);

    return () => clearInterval(intervalo);
}, []);

    const relatorioFiltrado = relatorio.filter(item =>
        (
            (item.nome || "") +
            " " +
            (item.email || "") +
            " " +
            (item.departamento || "") +
            " " +
            (item.patrimonio || "") +
            " " +
            (item.computador || "") +
            " " +
            (item.serial || "")
        )
            .toLowerCase()
            .includes(filtro.toLowerCase())
    );

    return (
        <div className="container">
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px"
                }}
            >
                <h1>Painel Administrativo</h1>

                <div
                    style={{
                        display: "flex",
                        gap: "10px"
                    }}
                >
                    <button
                        onClick={exportarExcel}
                        style={{
                            background: "#16a34a",
                            color: "white",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "6px",
                            cursor: "pointer"
                        }}
                    >
                        Exportar Excel
                    </button>

                    <button
    onClick={limparHistorico}
    style={{
        background: "#f59e0b",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "6px",
        cursor: "pointer"
    }}
>
    Limpar Histórico
</button>

                    <button
                        onClick={sair}
                        style={{
                            background: "#dc2626",
                            color: "white",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "6px",
                            cursor: "pointer"
                        }}
                    >
                        Sair
                    </button>
                    
                </div>
            </div>

            <div className="stats">
                <div className="stat-box">
                    <h2>{devices.length}</h2>
                    <p>Equipamentos</p>
                </div>

                <div className="stat-box">
                    <h2>{usuariosUnicos}</h2>
                    <p>Usuários Ativos</p>
                </div>

                <div className="stat-box">
                    <h2>{departamentosUnicos}</h2>
                    <p>Departamentos</p>
                </div>

                <div className="stat-box">
                    <h2 style={{ fontSize: "14px" }}>
                        {ultimoCheckin}
                    </h2>
                    <p>Último Check-in</p>
                </div>
            </div>

            <div className="card">
                <input
                    type="text"
                    placeholder="Pesquisar por patrimônio, computador, serial, fabricante ou UUID..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                />
            </div>

            <div className="card">
                <h2>Histórico de Check-ins</h2>

                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Departamento</th>
                            <th>Data</th>
                        </tr>
                    </thead>

                    <tbody>
                        {checkins.map((item, index) => (
                            <tr key={index}>
                                <td>{item.nome}</td>
                                <td>{item.email}</td>
                                <td>{item.departamento}</td>
                                <td>
                                    {new Date(item.createdAt)
                                        .toLocaleString("pt-BR")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="card">
                <h2>Equipamentos Cadastrados</h2>

                <table>
                    <thead>
                        <tr>
                            <th>Patrimônio</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Departamento</th>
                            <th>Computador</th>
                            <th>Fabricante</th>
                            <th>Modelo</th>
                            <th>Serial</th>
                            <th>Último Check-in</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {relatorioFiltrado.map((item, index) => (
                            <tr key={index}>
                                <td>{item.patrimonio}</td>
                                <td>{item.nome}</td>
                                <td>{item.email}</td>
                                <td>{item.departamento}</td>
                                <td>{item.computador}</td>
                                <td>{item.fabricante}</td>
                                <td>{item.modelo}</td>
                                <td>{item.serial}</td>
                                <td>
                                    {new Date(item.createdAt)
                                        .toLocaleString("pt-BR")}
                                </td>
                                <td>
                                    <button
                                        onClick={() =>
                                            setEquipamentoSelecionado(item)
                                        }
                                        style={{
                                            background: "#2563eb",
                                            color: "white",
                                            border: "none",
                                            padding: "6px 12px",
                                            borderRadius: "6px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Detalhes
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {equipamentoSelecionado && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999
                    }}
                >
                    <div
                        style={{
                            background: "white",
                            padding: "25px",
                            borderRadius: "10px",
                            width: "90%",
                            maxWidth: "700px",
                            boxSizing: "border-box",
                            maxHeight: "80vh",
                            overflowY: "auto"
                        }}
                    >
                        <h2>Detalhes do Equipamento</h2>

                        <hr />

                        <p><strong>Patrimônio:</strong> {equipamentoSelecionado.patrimonio}</p>
                        <p><strong>Usuário:</strong> {equipamentoSelecionado.nome}</p>
                        <p><strong>Email:</strong> {equipamentoSelecionado.email}</p>
                        <p><strong>Departamento:</strong> {equipamentoSelecionado.departamento}</p>

                        <hr />

                        <p><strong>Computador:</strong> {equipamentoSelecionado.computador}</p>
                        <p><strong>Fabricante:</strong> {equipamentoSelecionado.fabricante}</p>
                        <p><strong>Modelo:</strong> {equipamentoSelecionado.modelo}</p>
                        <p><strong>Serial:</strong> {equipamentoSelecionado.serial}</p>

                        <hr />

                        <p><strong>CPU:</strong> {equipamentoSelecionado.cpu}</p>
                        <p><strong>RAM:</strong> {equipamentoSelecionado.ramGb} GB</p>
                        <p><strong>GPU:</strong> {equipamentoSelecionado.gpu}</p>

                        <hr />

                        <p><strong>Sistema:</strong> {equipamentoSelecionado.sistema}</p>
                        <p><strong>Disco:</strong> {equipamentoSelecionado.disco}</p>
                        <p><strong>Tamanho:</strong> {equipamentoSelecionado.discoGb} GB</p>

                        <hr />

                        <p><strong>UUID:</strong> {equipamentoSelecionado.uuid}</p>

                        <button
                            onClick={() => setEquipamentoSelecionado(null)}
                            style={{
                                marginTop: "20px",
                                background: "#dc2626",
                                color: "white",
                                border: "none",
                                padding: "10px 20px",
                                borderRadius: "6px",
                                cursor: "pointer"
                            }}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Admin;
           