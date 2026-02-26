import HeroesSection from "./HeroesSection";
import PartidasRecientes from "./PartidasRecientes";

export default function PlayerPage({ data, onVolver }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
        <button
          onClick={onVolver}
          style={{
            padding: "8px 20px", borderRadius: 20, border: "1px solid #444",
            background: "transparent", color: "white", cursor: "pointer", fontSize: 13
          }}
        >
          ← Volver
        </button>
        <h2 style={{ margin: 0 }}>Perfil #{data.account_id}</h2>
      </div>
      <HeroesSection stats={data.heroes_stats} />
      <PartidasRecientes partidas={data.partidas} total={data.total_partidas_cargadas} />
    </div>
  );
}