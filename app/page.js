'use client'
import { useState } from 'react'

const C = {
  bg: '#080F1A', bgCard: '#0E1B2E', bgInput: '#111E30',
  border: 'rgba(201,168,76,0.2)', borderFocus: 'rgba(201,168,76,0.6)',
  gold: '#C9A84C', goldBright: '#E8C96A', cream: '#F5F0E8',
  muted: 'rgba(245,240,232,0.45)', dim: 'rgba(245,240,232,0.25)',
  section: '#1B3A5C',
}

// ─── DERIVED FLAGS FROM DATA ─────────────────────────────────────────
function flags(data) {
  const nat = (data.nationality || '').toLowerCase()
  const isMexican  = nat.includes('mexic')
  const isUS       = nat.includes('americ') || nat.includes('united states') || nat.includes('usa') || nat.includes('estadounid')
  const isCanadian = nat.includes('canad')
  const isForeign  = !isMexican

  const ms = data.maritalStatus || ''
  const isMarried  = ms.includes('Married') || ms.includes('Common Law')

  const occ = (data.occupation || '').toLowerCase()
  const isRetired  = occ.includes('retir') || occ.includes('jubil') || occ.includes('pensionado')

  return { isMexican, isUS, isCanadian, isForeign, isMarried, isRetired }
}

// ─── STYLES ──────────────────────────────────────────────────────────
const S = {
  page:  { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: C.bg },
  header: { background: 'rgba(8,15,26,0.98)', borderBottom: `1px solid ${C.border}`, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 },
  main:  { flex: 1, padding: '32px 20px', maxWidth: 760, width: '100%', margin: '0 auto' },
  card:  { background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, padding: '20px 24px', marginBottom: 16 },
  secHdr: { background: C.section, borderRadius: 6, padding: '10px 16px', marginBottom: 16, marginTop: 8, fontSize: 11, fontWeight: 'bold', letterSpacing: '0.12em', color: C.goldBright },
  label: { display: 'block', fontSize: 11, fontWeight: 'bold', color: C.muted, letterSpacing: '0.06em', marginBottom: 5, textTransform: 'uppercase' },
  input: { width: '100%', background: C.bgInput, border: '1px solid rgba(201,168,76,0.15)', borderRadius: 4, padding: '9px 12px', fontSize: 13, color: C.cream, outline: 'none', boxSizing: 'border-box', fontFamily: 'Arial, sans-serif' },
  textarea: { width: '100%', background: C.bgInput, border: '1px solid rgba(201,168,76,0.15)', borderRadius: 4, padding: '9px 12px', fontSize: 13, color: C.cream, outline: 'none', boxSizing: 'border-box', fontFamily: 'Arial, sans-serif', resize: 'vertical', minHeight: 64 },
  select: { width: '100%', background: C.bgInput, border: '1px solid rgba(201,168,76,0.15)', borderRadius: 4, padding: '9px 12px', fontSize: 13, color: C.cream, outline: 'none', boxSizing: 'border-box', fontFamily: 'Arial, sans-serif', appearance: 'none', cursor: 'pointer' },
  grid2:  { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  btnPrimary: { padding: '11px 28px', background: 'linear-gradient(135deg, rgba(201,168,76,0.3), rgba(201,168,76,0.15))', border: '1px solid rgba(201,168,76,0.6)', borderRadius: 5, color: C.gold, fontSize: 13, fontWeight: 'bold', letterSpacing: '0.06em', cursor: 'pointer', fontFamily: 'Arial, sans-serif' },
  btnSec: { padding: '10px 20px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 5, color: C.muted, fontSize: 12, cursor: 'pointer', fontFamily: 'Arial, sans-serif' },
  footer: { borderTop: `1px solid ${C.border}`, padding: '14px 24px', textAlign: 'center', fontSize: 11, color: C.dim, background: 'rgba(8,15,26,0.9)' },
}

// ─── FIELD COMPONENT ─────────────────────────────────────────────────
function Field({ label, fkey, value, onChange, type = 'text', placeholder = '', options, required }) {
  const onFocus = e => { e.target.style.borderColor = C.borderFocus }
  const onBlur  = e => { e.target.style.borderColor = 'rgba(201,168,76,0.15)' }
  const lbl = <label style={S.label}>{label}{required && <span style={{ color: C.gold }}> *</span>}</label>

  if (type === 'select') return (
    <div>
      {lbl}
      <div style={{ position: 'relative' }}>
        <select style={S.select} value={value || ''} onChange={e => onChange(fkey, e.target.value)}>
          {options.map(o => <option key={o} value={o}>{o || '— Select —'}</option>)}
        </select>
        <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: C.gold, pointerEvents: 'none', fontSize: 10 }}>▼</span>
      </div>
    </div>
  )
  if (type === 'textarea') return (
    <div>
      {lbl}
      <textarea style={S.textarea} placeholder={placeholder} value={value || ''} rows={3}
        onChange={e => onChange(fkey, e.target.value)} onFocus={onFocus} onBlur={onBlur} />
    </div>
  )
  return (
    <div>
      {lbl}
      <input style={S.input} type={type === 'date-text' ? 'text' : type} placeholder={placeholder}
        value={value || ''} onChange={e => onChange(fkey, e.target.value)} onFocus={onFocus} onBlur={onBlur} />
    </div>
  )
}

// ─── ROW HELPERS ─────────────────────────────────────────────────────
function Row2({ children }) {
  return <div style={{ ...S.grid2, marginBottom: 14 }}>{children}</div>
}
function Row1({ children }) {
  return <div style={{ marginBottom: 14 }}>{children}</div>
}
function SecHdr({ label }) {
  return <div style={S.secHdr}>{label}</div>
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────
export default function GeneralesGen() {
  const [data, setData] = useState({})
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const set = (k, v) => { setData(p => ({ ...p, [k]: v })); setSaved(false) }
  const f = key => data[key] || ''

  const { isMexican, isUS, isCanadian, isForeign, isMarried, isRetired } = flags(data)

  // Total visible fields for progress — count non-section visible ones
  // Rough estimate updated dynamically
  const allKeys = Object.keys(data).filter(k => !k.startsWith('_'))
  const filled = allKeys.filter(k => data[k] && String(data[k]).trim()).length

  const handleGenerate = async () => {
    if (!f('firstName') && !f('lastName')) { setError('Nombre requerido.'); return }
    setError(''); setGenerating(true)
    try {
      // Build fullName from parts
      const payload = {
        ...data,
        fullName: [f('lastName'), f('firstName')].filter(Boolean).join(', '),
        // homePhone fallback to cellPhone
        homePhone: f('homePhone') || f('cellPhone'),
      }
      const res = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('Error generando DOCX')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const name = (f('lastName') || 'CLIENTE').replace(/[^A-Z0-9]/gi, '_').toUpperCase().slice(0, 20)
      a.href = url; a.download = `GENERALES_${name}.docx`; a.click()
      URL.revokeObjectURL(url)
    } catch { setError('Error generando el documento. Intenta de nuevo.') }
    setGenerating(false)
  }

  const handleSave = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `generales_${(f('lastName') || 'cliente').toLowerCase()}.json`; a.click()
    URL.revokeObjectURL(url); setSaved(true)
  }

  const handleLoad = () => {
    const input = document.createElement('input'); input.type = 'file'; input.accept = '.json'
    input.onchange = e => {
      const file = e.target.files[0]; if (!file) return
      const reader = new FileReader()
      reader.onload = ev => { try { setData(JSON.parse(ev.target.result)); setSaved(true) } catch { setError('JSON inválido.') } }
      reader.readAsText(file)
    }
    input.click()
  }

  return (
    <div style={S.page}>

      {/* HEADER */}
      <header style={S.header}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 'bold', letterSpacing: '0.05em', background: `linear-gradient(90deg, ${C.gold}, ${C.goldBright}, ${C.gold})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>GeneralesGen</div>
          <div style={{ fontSize: 10, color: C.dim, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Expat Advisor MX — Ficha de Generales</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={S.btnSec} onClick={handleLoad}>↑ Cargar</button>
          <button style={S.btnSec} onClick={handleSave}>{saved ? '✓ Guardado' : '↓ Guardar'}</button>
          <button style={{ ...S.btnSec, color: 'rgba(231,76,60,0.6)', borderColor: 'rgba(231,76,60,0.3)' }} onClick={() => { setData({}); setSaved(false); setError('') }}>Limpiar</button>
        </div>
      </header>

      {/* PROGRESS */}
      <div style={{ background: 'rgba(14,27,46,0.8)', borderBottom: `1px solid ${C.border}`, padding: '12px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ flex: 1, height: 4, background: 'rgba(201,168,76,0.1)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min(100, Math.round(filled / 18 * 100))}%`, background: `linear-gradient(90deg, ${C.gold}, ${C.goldBright})`, borderRadius: 2, transition: 'width 0.3s' }} />
          </div>
          <div style={{ fontSize: 11, color: C.muted, whiteSpace: 'nowrap' }}>{filled} campos</div>
        </div>
      </div>

      {/* FORM */}
      <main style={S.main}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, color: C.gold, margin: '0 0 6px', fontFamily: 'Georgia, serif' }}>Ficha de Generales del Cliente</h2>
          <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>Los campos se adaptan automáticamente según nacionalidad, estado civil y ocupación.</p>
        </div>

        <div style={S.card}>

          {/* ── 1. PERSONAL */}
          <SecHdr label="1. PERSONAL INFORMATION" />
          <Row2>
            <Field fkey="firstName" label="Nombre(s) / First Name" placeholder="Rolando" value={f('firstName')} onChange={set} required />
            <Field fkey="lastName"  label="Apellido(s) / Last Name(s)" placeholder="Romero García" value={f('lastName')}  onChange={set} required />
          </Row2>
          <Row2>
            <Field fkey="dob"         label="Date of Birth / Fecha de Nacimiento" placeholder="DD/MM/YYYY" value={f('dob')} onChange={set} type="date-text" />
            <Field fkey="pob"         label="Place of Birth / Lugar de Nacimiento" placeholder="Puerto Vallarta, Jalisco" value={f('pob')} onChange={set} />
          </Row2>
          <Row2>
            <Field fkey="nationality" label="Nationality / Nacionalidad"
              type="select"
              options={['', 'Mexicana', 'American / Estadounidense', 'Canadian / Canadiense', 'Other / Otra']}
              value={f('nationality')} onChange={set} />
            <Field fkey="maritalStatus" label="Marital Status / Estado Civil"
              type="select"
              options={['', 'Single / Soltero(a)', 'Married / Casado(a)', 'Divorced / Divorciado(a)', 'Widowed / Viudo(a)', 'Common Law / Unión libre']}
              value={f('maritalStatus')} onChange={set} />
          </Row2>
          {isMarried && (
            <Row1>
              <Field fkey="maritalRegime" label="Marital Regime / Régimen Matrimonial"
                type="select"
                options={['', 'Separate Property / Bienes Separados', 'Community Property / Sociedad Conyugal']}
                value={f('maritalRegime')} onChange={set} />
            </Row1>
          )}

          {/* ── 2. ID DOCUMENTS */}
          <SecHdr label="2. IDENTIFICATION DOCUMENTS" />
          <Row2>
            <Field fkey="idType" label="ID Type / Tipo de Identificación"
              type="select"
              options={['', 'Passport / Pasaporte', 'INE / IFE', 'Resident Card / Tarjeta de Residencia', "Driver's License / Licencia de Conducir"]}
              value={f('idType')} onChange={set} />
            <Field fkey="idNumber" label="ID Number / Número" placeholder="Ej. A63887765" value={f('idNumber')} onChange={set} />
          </Row2>
          <Row2>
            <Field fkey="idIssued" label="Date Issued / Fecha de Emisión" placeholder="YYYY" value={f('idIssued')} onChange={set} />
            <Field fkey="idExpiry" label="Expiration / Vencimiento" placeholder="YYYY" value={f('idExpiry')} onChange={set} />
          </Row2>
          <Row1>
            <Field fkey="idIssuingAuth" label="Issuing Authority / Autoridad Emisora"
              placeholder="Ej. Mexican Government / United States Government"
              value={f('idIssuingAuth')} onChange={set} />
          </Row1>

          {/* ── 3. TAX — inteligente por nacionalidad */}
          <SecHdr label="3. TAX IDENTIFIERS" />
          {isMexican ? (
            <Row2>
              <Field fkey="curp" label="CURP" placeholder="ROGR660427HJCMRL00" value={f('curp')} onChange={set} />
              <Field fkey="rfc"  label="RFC"  placeholder="ROGR660427SK8" value={f('rfc')} onChange={set} />
            </Row2>
          ) : isUS ? (
            <Row1>
              <Field fkey="ssn" label="Social Security Number (SSN)" placeholder="XXX-XX-XXXX" value={f('ssn')} onChange={set} />
            </Row1>
          ) : isCanadian ? (
            <Row1>
              <Field fkey="ssn" label="Social Insurance Number (SIN)" placeholder="NNN NNN NNN" value={f('ssn')} onChange={set} />
            </Row1>
          ) : (
            // Other / unknown nationality — show all
            <>
              <Row2>
                <Field fkey="curp" label="CURP (si aplica)" placeholder="ROGR660427HJCMRL00" value={f('curp')} onChange={set} />
                <Field fkey="rfc"  label="RFC (si aplica)"  placeholder="ROGR660427SK8" value={f('rfc')} onChange={set} />
              </Row2>
              <Row1>
                <Field fkey="ssn" label="SSN (US) / SIN (Canada)" placeholder="XXX-XX-XXXX  o  NNN NNN NNN" value={f('ssn')} onChange={set} />
              </Row1>
            </>
          )}

          {/* ── 4. CONTACT */}
          <SecHdr label="4. CONTACT INFORMATION" />
          <Row1>
            <Field fkey="email" label="Email" placeholder="cliente@ejemplo.com" value={f('email')} onChange={set} type="email" />
          </Row1>
          <Row2>
            <Field fkey="cellPhone" label="Cell Phone / Celular" placeholder="+52 322 000 0000" value={f('cellPhone')} onChange={set} type="tel" />
            <Field fkey="homePhone" label="Home Phone / Tel. Casa (si distinto al celular)" placeholder="+1 555 000 0000" value={f('homePhone')} onChange={set} type="tel" />
          </Row2>

          {/* ── 5. ADDRESS — inteligente por nacionalidad */}
          <SecHdr label="5. ADDRESS / DOMICILIO" />
          <Row1>
            <Field fkey="addressMX" label="Address in Mexico / Domicilio en México" placeholder="Calle, número, colonia, municipio, estado, C.P." value={f('addressMX')} onChange={set} type="textarea" />
          </Row1>
          {isForeign && (
            <Row1>
              <Field fkey="addressAbroad" label="Address Abroad / Domicilio en el Extranjero" placeholder="Street, City, State, ZIP, Country" value={f('addressAbroad')} onChange={set} type="textarea" />
            </Row1>
          )}

          {/* ── 6. OCCUPATION — colapsa si retirado */}
          <SecHdr label="6. OCCUPATION / EMPRESA" />
          <Row1>
            <Field fkey="occupation" label="Occupation / Ocupación" placeholder="Ej. Attorney, Retired / Jubilado, Empresario" value={f('occupation')} onChange={set} />
          </Row1>
          {!isRetired && (
            <>
              <Row2>
                <Field fkey="positionInCompany" label="Position / Puesto" placeholder="Ej. Owner, Director General" value={f('positionInCompany')} onChange={set} />
                <Field fkey="companyName"        label="Company / Empresa" placeholder="Ej. Expat Advisor MX" value={f('companyName')} onChange={set} />
              </Row2>
              <Row2>
                <Field fkey="companyType"  label="Type of Company / Tipo" placeholder="Ej. Consultoría, S.A. de C.V." value={f('companyType')} onChange={set} />
                <Field fkey="companyPhone" label="Company Phone / Tel. Empresa" placeholder="+52 322 000 0000" value={f('companyPhone')} onChange={set} type="tel" />
              </Row2>
              <Row1>
                <Field fkey="companyAddress" label="Company Address / Domicilio Empresa" placeholder="Dirección completa" value={f('companyAddress')} onChange={set} type="textarea" />
              </Row1>
            </>
          )}

          {/* ── 7 & 8. REFERENCIAS */}
          <SecHdr label="7. PERSONAL REFERENCE 1 / REFERENCIA PERSONAL 1 (Optional)" />
          <Row2>
            <Field fkey="ref1Name"  label="Name / Nombre" placeholder="Nombre completo" value={f('ref1Name')} onChange={set} />
            <Field fkey="ref1Phone" label="Phone / Teléfono" placeholder="+52 322 000 0000" value={f('ref1Phone')} onChange={set} type="tel" />
          </Row2>
          <Row2>
            <Field fkey="ref1Email"   label="Email" placeholder="email@ejemplo.com" value={f('ref1Email')} onChange={set} type="email" />
            <Field fkey="ref1Address" label="Address / Domicilio" placeholder="Domicilio completo" value={f('ref1Address')} onChange={set} />
          </Row2>

          <SecHdr label="8. PERSONAL REFERENCE 2 / REFERENCIA PERSONAL 2 (Optional)" />
          <Row2>
            <Field fkey="ref2Name"  label="Name / Nombre" placeholder="Nombre completo" value={f('ref2Name')} onChange={set} />
            <Field fkey="ref2Phone" label="Phone / Teléfono" placeholder="+52 322 000 0000" value={f('ref2Phone')} onChange={set} type="tel" />
          </Row2>
          <Row2>
            <Field fkey="ref2Email"   label="Email" placeholder="email@ejemplo.com" value={f('ref2Email')} onChange={set} type="email" />
            <Field fkey="ref2Address" label="Address / Domicilio" placeholder="Domicilio completo" value={f('ref2Address')} onChange={set} />
          </Row2>

        </div>

        {error && (
          <div style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: 6, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: '#E74C3C' }}>
            ⚠ {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8 }}>
          <button style={S.btnSec} onClick={handleSave}>↓ Guardar JSON</button>
          <button style={{ ...S.btnPrimary, opacity: generating ? 0.6 : 1 }} onClick={handleGenerate} disabled={generating}>
            {generating ? '⏳ Generando...' : '⬇ Descargar DOCX'}
          </button>
        </div>

        <div style={{ marginTop: 24, padding: '12px 16px', background: 'rgba(27,58,92,0.3)', borderLeft: `3px solid ${C.gold}`, borderRadius: 4, fontSize: 11, color: C.dim, lineHeight: 1.6 }}>
          <strong style={{ color: C.muted }}>Inteligente:</strong> Los campos se muestran según nacionalidad (RFC/SSN/SIN), estado civil (régimen), y ocupación (empresa oculta si jubilado). Para agregar campos: 1 línea en el código.
        </div>
      </main>

      <footer style={S.footer}>GeneralesGen v1.1  |  Expat Advisor MX  |  La Colmena 2026</footer>
    </div>
  )
}
