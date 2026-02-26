import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { PIE_COLORS } from "../utils/helpers";

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div style={{
        background: "#1e1e1e", border: "1px solid #444",
        borderRadius: 8, padding: "10px 16px", fontSize: 13
      }}>
        <p style={{ margin: 0, fontWeight: "bold", color: "#fff" }}>{d.name}</p>
        <p style={{ margin: "4px 0 0", color: "#aaa" }}>{d.value} partidas</p>
        <p style={{ margin: "2px 0 0" }}>
          <span style={{ color: "#4CAF50" }}>{d.wins}W</span>{" – "}
          <span style={{ color: "#f44336" }}>{d.losses}L</span>
        </p>
        <p style={{ margin: "2px 0 0", color: d.winrate >= 50 ? "#4CAF50" : "#f44336", fontWeight: "bold" }}>
          {d.winrate}% winrate
        </p>
      </div>
    );
  }
  return null;
};

export default function HeroesSection({ stats }) {
  if (!stats || stats.length === 0) return null;

  const pieData = stats
    .filter((h) => h.total_partidas > 0)
    .map((h) => ({
      name: h.heroe,
      value: Number(h.total_partidas),
      wins: Number(h.wins),
      losses: Number(h.losses),
      winrate: Math.round((Number(h.wins) / Number(h.total_partidas)) * 100),
    }));

  return (
    <section style={{ marginBottom: 32 }}>
      <h3 style={{ borderBottom: "2px solid #333", paddingBottom: 10, marginBottom: 20 }}>
        🥧 Rendimiento por Héroe
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 32, alignItems: "start" }}>

        {/* Torta */}
        <div style={{ background: "#1a1a1a", borderRadius: 10, padding: 16 }}>
          <p style={{ color: "#888", fontSize: 12, textAlign: "center", margin: "0 0 8px" }}>Partidas por héroe</p>
            <PieChart width={308} height={308}>
                <Pie
                  data={pieData}
                  cx={154}
                  cy={130}
                  outerRadius={100}
                  dataKey="value"
                  isAnimationActive={false}
                >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend formatter={(value) => <span style={{ color: "#ccc", fontSize: 11 }}>{value}</span>} />
            </PieChart>
        </div>

        {/* Tabla */}
        <div style={{ background: "#1a1a1a", borderRadius: 10, overflow: "hidden" }}>
          <table border="0" cellPadding="10" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ color: "#aaa", textTransform: "uppercase", fontSize: 11, borderBottom: "2px solid #333" }}>
                <th style={{ padding: "12px 16px" }}>Héroe</th>
                <th style={{ padding: "12px 8px" }}>Partidas</th>
                <th style={{ padding: "12px 8px" }}>W / L</th>
                <th style={{ padding: "12px 8px" }}>Winrate</th>
                <th style={{ padding: "12px 8px" }}>K / D / A</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((h, i) => {
                const winrate = h.total_partidas > 0 ? Math.round((h.wins / h.total_partidas) * 100) : 0;
                return (
                  <tr key={h.heroe} style={{ borderBottom: "1px solid #222", backgroundColor: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                    <td style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", flexShrink: 0, backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <img src={h.image} alt={h.heroe} width={44} style={{ borderRadius: 4 }}
                        onError={(e) => e.target.src = "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/abaddon.png"} />
                      <span style={{ fontWeight: "bold", fontSize: 13 }}>{h.heroe}</span>
                    </td>
                    <td style={{ padding: "10px 8px", color: "#aaa" }}>{h.total_partidas}</td>
                    <td style={{ padding: "10px 8px" }}>
                      <span style={{ color: "#4CAF50" }}>{h.wins}W</span>{" – "}
                      <span style={{ color: "#f44336" }}>{h.losses}L</span>
                    </td>
                    <td style={{ padding: "10px 8px" }}>
                      <span style={{
                        padding: "2px 8px", borderRadius: 12, fontSize: 12, fontWeight: "bold",
                        backgroundColor: winrate >= 50 ? "rgba(76,175,80,0.15)" : "rgba(244,67,54,0.15)",
                        color: winrate >= 50 ? "#4CAF50" : "#f44336"
                      }}>{winrate}%</span>
                    </td>
                    <td style={{ padding: "10px 8px", fontSize: 13 }}>
                      <span style={{ color: "#4CAF50" }}>{h.avg_kills}</span>{" / "}
                      <span style={{ color: "#f44336" }}>{h.avg_deaths}</span>{" / "}
                      <span>{h.avg_assists}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
