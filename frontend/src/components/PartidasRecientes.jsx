import { calcularHaceCuanto } from "../utils/helpers";

export default function PartidasRecientes({ partidas, total }) {
  return (
    <section>
      <h3 style={{ borderBottom: "2px solid #333", paddingBottom: 10, marginBottom: 20 }}>
        📊 Partidas Recientes ({total})
      </h3>
      <div style={{ background: "#1a1a1a", borderRadius: 10, overflow: "hidden" }}>
        <table border="0" cellPadding="0" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ color: "#aaa", textTransform: "uppercase", fontSize: 11, borderBottom: "2px solid #333" }}>
              <th style={{ padding: "12px 16px" }}>Resultado</th>
              <th style={{ padding: "12px 8px" }}>Héroe</th>
              <th style={{ padding: "12px 8px" }}>K / D / A</th>
              <th style={{ padding: "12px 8px" }}>Cuándo</th>
              <th style={{ padding: "12px 16px" }}>Match ID</th>
            </tr>
          </thead>
          <tbody>
            {partidas.map((p) => (
              <tr key={p.Match_id} style={{
                borderBottom: "1px solid #1e1e1e",
                backgroundColor: p.won ? "rgba(76,175,80,0.04)" : "rgba(244,67,54,0.04)"
              }}>
                <td style={{ padding: "10px 16px" }}>
                  <span style={{
                    padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: "bold",
                    backgroundColor: p.won ? "#1b5e20" : "#b71c1c",
                    color: p.won ? "#4CAF50" : "#f44336"
                  }}>{p.won ? "WIN" : "LOSS"}</span>
                </td>
                <td style={{ padding: "10px 8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <img src={p.image} alt={p.Localized_Name} width={44} style={{ borderRadius: 4 }}
                      onError={(e) => e.target.src = "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/abaddon.png"} />
                    <span style={{ fontSize: 13 }}>{p.Localized_Name}</span>
                    {p.is_mvp && <span style={{ color: "#38bdf8", fontWeight: "bold", fontSize: 11, letterSpacing: 1 }}>MVP</span>}
                  </div>
                </td>
                <td style={{ padding: "10px 8px", fontSize: 13 }}>
                  <b style={{ color: "#4CAF50" }}>{p.Kills}</b>{" / "}
                  <b style={{ color: "#f44336" }}>{p.Deaths}</b>{" / "}
                  <b>{p.Assists}</b>
                </td>
                <td style={{ padding: "10px 8px", color: "#666", fontSize: 12 }}>{calcularHaceCuanto(p.Start_time)}</td>
                <td style={{ padding: "10px 16px", color: "#444", fontSize: 11 }}>{p.Match_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}