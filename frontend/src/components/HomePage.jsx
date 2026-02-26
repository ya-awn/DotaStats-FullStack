import { useState } from "react";

export default function HomePage({ onBuscar, cargando }) {
  const [accountId, setAccountId] = useState(
    () => localStorage.getItem("lastAccountId") || ""
  );

  const handleBuscar = () => {
    if (!accountId.trim()) return;
    localStorage.setItem("lastAccountId", accountId.trim());
    onBuscar(accountId.trim());
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
      <h1 style={{ fontSize: "4rem", marginBottom: 10 }}>
        🎮 Dota 2 <span style={{ color: "#e43333" }}>DB</span>
      </h1>
      <p style={{ color: "#888", marginBottom: 40, fontSize: 16 }}>
        Estadísticas de jugadores y héroes en tiempo real
      </p>
      <div style={{ display: "flex", gap: 10 }}>
        <input
          type="text"
          placeholder="Introduce tu Account ID (ej: 125687414)"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
          style={{
            padding: "15px 24px", width: "360px", borderRadius: "30px",
            border: "none", backgroundColor: "#2a2a2a", color: "white",
            fontSize: "16px", outline: "none"
          }}
        />
        <button
          onClick={handleBuscar}
          disabled={cargando}
          style={{
            padding: "15px 30px", borderRadius: "30px", border: "none",
            backgroundColor: cargando ? "#555" : "#e43333",
            color: "white", fontWeight: "bold", cursor: "pointer", fontSize: 15
          }}
        >
          {cargando ? "Sincronizando..." : "BUSCAR"}
        </button>
      </div>
      {cargando && (
        <p style={{ color: "#888", marginTop: 20, fontSize: 13 }}>
          ⏳ Sincronizando partidas con OpenDota, puede tardar unos segundos...
        </p>
      )}
    </div>
  );
}