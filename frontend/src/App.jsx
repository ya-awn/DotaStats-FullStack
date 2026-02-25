import { useState } from 'react'
import axios from 'axios'

const HERO_ALIASES = {
  'Kez': 'kez',
  'Ringmaster': 'ringmaster',
  "Nature's Prophet": 'furion',
  'Windranger': 'windrunner',
  'Clockwerk': 'rattletrap',
  'Underlord': 'abyssal_underlord',
  'Wraith King': 'skeleton_king',
  'Zeus': 'zuus',
  'Necrophos': 'necrolyte',
  'Timbersaw': 'shredder',
  'Outworld Destroyer': 'obsidian_destroyer',
  'Magnus': 'magnataur',
  'Lifestealer': 'life_stealer',
}

function getHeroImageUrl(localizedName) {
  const key = HERO_ALIASES[localizedName] || 
    localizedName.toLowerCase().replace(/\s+/g, '_')
  return `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${key}_full.png`
}

function App() {
  const [accountId, setAccountId] = useState('')
  const [datos, setDatos] = useState(null)
  const [error, setError] = useState(null)

  const buscarJugador = async () => {
    try {
      setError(null)
      const res = await axios.get(`http://127.0.0.1:5000/api/jugador/${accountId}`)
      setDatos(res.data)
    } catch {
      setError('No se encontró el jugador o el servidor está apagado')
      setDatos(null)
    }
  }

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'sans-serif',
      backgroundColor: '#1a1a1a',
      color: 'white',
      minHeight: '100vh',
    }}>
      <h1>Dota 2 Dashboard 🎮</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Ingresá Account ID (ej: 61374303)"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          style={{ padding: '10px', borderRadius: '5px', border: 'none', marginRight: '10px' }}
        />
        <button
          onClick={buscarJugador}
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            backgroundColor: '#646cff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          Buscar
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {datos && (
        <div style={{ backgroundColor: '#2a2a2a', padding: '20px', borderRadius: '10px' }}>
          <h2>Resultados para ID: {datos.account_id}</h2>
          <p>Partidas encontradas: {datos.total_partidas_cargadas}</p>

          <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#333' }}>
                <th style={{ padding: '10px' }}>Héroe</th>
                <th style={{ padding: '10px' }}>Kills</th>
                <th style={{ padding: '10px' }}>Deaths</th>
                <th style={{ padding: '10px' }}>Assists</th>
              </tr>
            </thead>

            <tbody>
              {datos.partidas.map((p, index) => (
                <tr key={index} style={{ textAlign: 'center' }}>
                  <td style={{ padding: '10px', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={getHeroImageUrl(p.Localized_Name)}
                        alt={p.Localized_Name}
                        style={{ width: '60px', height: '34px', objectFit: 'cover', borderRadius: '4px' }}
                        onError={(e) => {
                          e.currentTarget.onerror = null
                          e.currentTarget.src = 'https://via.placeholder.com/60x34?text=?'
                        }}
                      />
                      <span>{p.Localized_Name}</span>
                    </div>
                  </td>
                  <td style={{ color: '#4caf50', fontWeight: 'bold' }}>{p.Kills}</td>
                  <td style={{ color: '#f44336', fontWeight: 'bold' }}>{p.Deaths}</td>
                  <td style={{ fontWeight: 'bold' }}>{p.Assists}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default App