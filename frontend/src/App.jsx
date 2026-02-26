import { useState } from "react";
import HomePage from "./components/HomePage";
import PlayerPage from "./components/PlayerPage";

const API = "http://localhost:5000";

export default function App() {
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(false);

  const buscar = (accountId) => {
    if (!accountId) return;
    setCargando(true);
    fetch(`${API}/api/jugador/${accountId}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.error) {
          alert("Error: " + res.error);
          setCargando(false);
          return;
        }
        setData(res);
        setCargando(false);
      })
      .catch((err) => {
        console.error(err);
        alert("No se pudo conectar al servidor. ¿Está corriendo Flask?");
        setCargando(false);
      });
  };

  return (
    <div style={{
      backgroundColor: "#121212", color: "white", minHeight: "100vh",
      padding: "32px 40px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {!data
        ? <HomePage onBuscar={buscar} cargando={cargando} />
        : <PlayerPage data={data} onVolver={() => setData(null)} />
      }
      <footer style={{ textAlign: "center", marginTop: 60, color: "#333", fontSize: 11 }}>
        Dota 2 DB Project — Datos provistos por OpenDota API
      </footer>
    </div>
  );
}