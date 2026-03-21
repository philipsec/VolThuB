import { useEffect, useState } from 'react';

const API = 'http://localhost:3001';

export default function SecurityDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [threats, setThreats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('logs');

  const fetchData = async () => {
    try {
      const [s, l, t] = await Promise.all([
        fetch(API + '/api/security/stats').then(r => r.json()),
        fetch(API + '/api/security/logs?limit=50').then(r => r.json()),
        fetch(API + '/api/security/threats?limit=50').then(r => r.json()),
      ]);
      setStats(s);
      setLogs(Array.isArray(l) ? l : []);
      setThreats(Array.isArray(t) ? t : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const iv = setInterval(fetchData, 10000);
    return () => clearInterval(iv);
  }, []);

  if (loading) return <div style={{padding:'40px',color:'#fff'}}>Loading...</div>;

  return (
    <div style={{padding:'24px',background:'#0a0f1e',minHeight:'100vh',color:'#fff',fontFamily:'monospace'}}>
      <h1 style={{color:'#00ff88',marginBottom:'8px'}}>Network Threat Detection Dashboard</h1>
      <p style={{color:'#888',marginBottom:'24px',fontSize:'13px'}}>Auto-refreshes every 10 seconds</p>

      {stats && (
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',marginBottom:'24px'}}>
          {[
            {label:'Total Packets', value:stats.total_packets, color:'#0052FF'},
            {label:'Threats Detected', value:stats.total_threats, color:'#ff9900'},
            {label:'High Severity', value:stats.high_severity, color:'#ff3333'},
            {label:'Protocols', value:stats.protocol_breakdown.length, color:'#00ff88'},
          ].map(card => (
            <div key={card.label} style={{background:'#111827',borderRadius:'8px',padding:'20px',borderLeft:'4px solid '+card.color}}>
              <div style={{color:'#9ca3af',fontSize:'12px',marginBottom:'8px'}}>{card.label}</div>
              <div style={{color:'#fff',fontSize:'28px',fontWeight:'bold'}}>{card.value}</div>
            </div>
          ))}
        </div>
      )}

      {stats && (
        <div style={{background:'#111827',borderRadius:'8px',padding:'16px',marginBottom:'24px'}}>
          <div style={{color:'#ccc',fontSize:'14px',marginBottom:'12px'}}>PROTOCOL BREAKDOWN</div>
          <div style={{display:'flex',gap:'16px'}}>
            {stats.protocol_breakdown.map((p: any) => (
              <div key={p.protocol} style={{background:'#1f2937',padding:'8px 16px',borderRadius:'6px'}}>
                <span style={{color:'#00ff88'}}>{p.protocol}</span>
                <span style={{color:'#fff',marginLeft:'8px',fontWeight:'bold'}}>{p.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{display:'flex',gap:'8px',marginBottom:'16px'}}>
        <button onClick={() => setActiveTab('logs')} style={{padding:'8px 16px',borderRadius:'6px',border:'none',cursor:'pointer',background:activeTab==='logs'?'#0052FF':'#1f2937',color:'#fff',fontFamily:'monospace'}}>
          Network Logs ({logs.length})
        </button>
        <button onClick={() => setActiveTab('threats')} style={{padding:'8px 16px',borderRadius:'6px',border:'none',cursor:'pointer',background:activeTab==='threats'?'#ff3333':'#1f2937',color:'#fff',fontFamily:'monospace'}}>
          Threats ({threats.length})
        </button>
      </div>

      {activeTab === 'logs' && (
        <div style={{background:'#111827',borderRadius:'8px',overflow:'hidden'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
            <thead>
              <tr style={{background:'#1f2937',color:'#9ca3af'}}>
                <th style={{padding:'10px 12px',textAlign:'left'}}>Time</th>
                <th style={{padding:'10px 12px',textAlign:'left'}}>Protocol</th>
                <th style={{padding:'10px 12px',textAlign:'left'}}>Source</th>
                <th style={{padding:'10px 12px',textAlign:'left'}}>Destination</th>
                <th style={{padding:'10px 12px',textAlign:'left'}}>Size</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log: any) => (
                <tr key={log.id} style={{borderBottom:'1px solid #1f2937'}}>
                  <td style={{padding:'8px 12px',color:'#d1d5db'}}>{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td style={{padding:'8px 12px',color:log.protocol==='TCP'?'#0052FF':'#00ff88'}}>{log.protocol}</td>
                  <td style={{padding:'8px 12px',color:'#d1d5db'}}>{log.src_ip}:{log.src_port}</td>
                  <td style={{padding:'8px 12px',color:'#d1d5db'}}>{log.dst_ip}:{log.dst_port}</td>
                  <td style={{padding:'8px 12px',color:'#d1d5db'}}>{log.packet_size}B</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'threats' && (
        <div style={{background:'#111827',borderRadius:'8px',overflow:'hidden'}}>
          {threats.length === 0 ? (
            <div style={{padding:'40px',textAlign:'center',color:'#888'}}>
              No threats detected yet. Run Kali Linux attack simulation to see threats here.
            </div>
          ) : (
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
              <thead>
                <tr style={{background:'#1f2937',color:'#9ca3af'}}>
                  <th style={{padding:'10px 12px',textAlign:'left'}}>Time</th>
                  <th style={{padding:'10px 12px',textAlign:'left'}}>Source IP</th>
                  <th style={{padding:'10px 12px',textAlign:'left'}}>Threat Type</th>
                  <th style={{padding:'10px 12px',textAlign:'left'}}>Severity</th>
                  <th style={{padding:'10px 12px',textAlign:'left'}}>Details</th>
                </tr>
              </thead>
              <tbody>
                {threats.map((t: any) => (
                  <tr key={t.id} style={{borderBottom:'1px solid #1f2937'}}>
                    <td style={{padding:'8px 12px',color:'#d1d5db'}}>{new Date(t.timestamp).toLocaleTimeString()}</td>
                    <td style={{padding:'8px 12px',color:'#d1d5db'}}>{t.src_ip}</td>
                    <td style={{padding:'8px 12px',color:'#d1d5db'}}>{t.threat_type}</td>
                    <td style={{padding:'8px 12px',color:t.severity==='HIGH'?'#ff3333':'#ff9900',fontWeight:'bold'}}>{t.severity}</td>
                    <td style={{padding:'8px 12px',color:'#d1d5db'}}>{t.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
