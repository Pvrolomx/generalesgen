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

  const occ = data.occupation || ''
  const isRetired    = occ.includes('Retired') || occ.includes('Unemployed')
  const isEmployed   = occ.includes('Employed')

  const legalStatus = data.legalStatus || ''
  const isResident = legalStatus.includes('Residente')

  return { isMexican, isUS, isCanadian, isForeign, isMarried, isRetired, isEmployed, isResident }
}



// ─── UNIT CONVERTERS ─────────────────────────────────────────────────
function feetInchesToMeters(ft, inches) {
  const totalInches = (parseFloat(ft) || 0) * 12 + (parseFloat(inches) || 0)
  return totalInches > 0 ? (totalInches * 0.0254).toFixed(2) : ''
}
function lbsToKg(lbs) {
  const v = parseFloat(lbs)
  return v > 0 ? (v * 0.453592).toFixed(1) : ''
}

// ─── DEMO DATA ───────────────────────────────────────────────────────
const DEMO_DATA = {
  firstName: 'Rolando',
  lastName: 'Romero García',
  dob: '27/04/1966',
  pob: 'Puerto Vallarta, Jalisco',
  nationality: 'Mexicana',
  maritalStatus: 'Married / Casado(a)',
  maritalRegime: 'Separate Property / Bienes Separados',
  idType: 'INE / IFE',
  idNumber: '1974076048195',
  idIssued: '2018',
  idExpiry: '2028',
  idIssuingAuth: 'Mexican Government',
  curp: 'ROGR660427HJCMRL00',
  rfc: 'ROGR660427SK8',
  email: 'pvrolomx@yahoo.com.mx',
  cellPhone: '322 111 0294',
  addressMX: 'Brasil 1434, 5 de Diciembre, Puerto Vallarta, Jalisco, 48350',
  occupation: 'Employed / Empleado',
  occupationDetail: 'Attorney / Abogado',
  positionInCompany: 'Auto Empleado / Self-Employed',
  companyName: 'Expat Advisor MX',
  companyType: 'Consultoría Inmobiliaria',
  companyPhone: '322 111 0294',
  companyAddress: 'Brasil 1434, 5 de Diciembre, Puerto Vallarta, Jalisco, 48350',
  showRef1: true,
  ref1Name: 'Claudia Rebeca Castillo Soto',
  ref1Address: 'Paseo del Arque 59, Las Ceibas, Bahía de Banderas, Nayarit, 63735',
  ref1Phone: '322 306 8482',
  ref1Email: 'claudia@castlesolutions.biz',
  showRef2: true,
  ref2Name: 'Sergio Arturo Miramontes Macías',
  ref2Address: 'Bolivia 1008, 5 de Diciembre, Puerto Vallarta, Jalisco, 48350',
  ref2Phone: '322 150 6996',
  ref2Email: 'smiramontesm@yahoo.com',
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
  const showRef1 = !!data.showRef1
  const showRef2 = !!data.showRef2
  const showMigracion = !!data.showMigracion
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const set = (k, v) => { setData(p => ({ ...p, [k]: v })); setSaved(false) }
  const f = key => data[key] || ''

  const { isMexican, isUS, isCanadian, isForeign, isMarried, isRetired, isEmployed, isResident } = flags(data)

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

  const handleDemo = () => { setData(DEMO_DATA); setSaved(false); setError('') }

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
          <button style={{ ...S.btnSec, color: C.gold, borderColor: 'rgba(201,168,76,0.5)', background: 'rgba(201,168,76,0.08)' }} onClick={handleDemo}>▶ Demo</button>
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
              options={isMexican
                ? ['', 'INE / IFE', 'Passport / Pasaporte', "Driver's License / Licencia de Conducir"]
                : ['Passport / Pasaporte', 'INE / IFE', 'Resident Card / Tarjeta de Residencia', "Driver's License / Licencia de Conducir"]}
              value={f('idType') || (isMexican ? '' : 'Passport / Pasaporte')}
              onChange={set} />
            <Field fkey="idNumber" label="ID Number / Número" placeholder="Ej. A63887765 / IDMEX..." value={f('idNumber')} onChange={set} />
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

          {/* Condición migratoria — solo extranjeros */}
          {isForeign && (
            <>
              <Row2>
                <Field fkey="legalStatus" label="Legal Status in Mexico / Condición Migratoria"
                  type="select"
                  options={['', 'Turista / Tourist (FMM)', 'Residente Temporal / Temporary Resident', 'Residente Permanente / Permanent Resident']}
                  value={f('legalStatus')} onChange={set} />
                {isResident && (
                  <Field fkey="migraDocNumber" label="Document Number / Número de Documento"
                    placeholder="Ej. ADQX1234567890" value={f('migraDocNumber')} onChange={set} />
                )}
              </Row2>
            </>
          )}

          {/* ── 3. TAX — inteligente por nacionalidad + condición migratoria */}
          <SecHdr label="3. TAX IDENTIFIERS" />

          {/* CURP: mexicanos siempre, extranjeros residentes siempre */}
          {(isMexican || isResident) && (
            <Row2>
              <Field fkey="curp" label={isMexican ? 'CURP' : 'CURP (asignado por INM)'}
                placeholder="ROGR660427HJCMRL00" value={f('curp')} onChange={set} />
              <Field fkey="rfc" label={isMexican ? 'RFC' : 'RFC (opcional)'}
                placeholder="ROGR660427SK8" value={f('rfc')} onChange={set} />
            </Row2>
          )}

          {/* SSN/SIN: extranjeros según país — turistas y residentes por igual */}
          {isForeign && isUS && (
            <Row1>
              <Field fkey="ssn" label="Social Security Number (SSN)" placeholder="XXX-XX-XXXX" value={f('ssn')} onChange={set} />
            </Row1>
          )}
          {isForeign && isCanadian && (
            <Row1>
              <Field fkey="ssn" label="Social Insurance Number (SIN)" placeholder="NNN NNN NNN" value={f('ssn')} onChange={set} />
            </Row1>
          )}
          {isForeign && !isUS && !isCanadian && !isResident && (
            <Row1>
              <Field fkey="ssn" label="Tax ID / Identificador Fiscal (país de origen)" placeholder="Número de identificación fiscal" value={f('ssn')} onChange={set} />
            </Row1>
          )}
          {isForeign && !isUS && !isCanadian && isResident && (
            <Row1>
              <Field fkey="ssn" label="Tax ID en país de origen (opcional)" placeholder="Número de identificación fiscal extranjero" value={f('ssn')} onChange={set} />
            </Row1>
          )}

          {/* Nota visual si extranjero residente sin condición seleccionada aún */}
          {isForeign && !isResident && !isUS && !isCanadian && (
            <div style={{ padding: '8px 12px', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 4, fontSize: 11, color: 'rgba(201,168,76,0.7)', marginBottom: 8 }}>
              Selecciona la Condición Migratoria en la sección anterior para ver los campos fiscales correspondientes.
            </div>
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

          {/* ── 6. OCCUPATION — select + conditional company block */}
          <SecHdr label="6. OCCUPATION / EMPRESA" />
          <Row2>
            <Field fkey="occupation" label="Employment Status / Situación Laboral"
              type="select"
              options={['', 'Employed / Empleado', 'Retired / Jubilado', 'Unemployed / Desempleado']}
              value={f('occupation')} onChange={set} />
            {isEmployed && (
              <Field fkey="occupationDetail" label="Occupation / Ocupación" placeholder="Ej. Attorney, Médico, Empresario" value={f('occupationDetail')} onChange={set} />
            )}
          </Row2>
          {isEmployed && (
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

          {/* ── 7. REFERENCIA 1 — toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0 0' }}>
            <div style={{ ...S.secHdr, margin: 0, flex: 1 }}>7. PERSONAL REFERENCE 1 / REFERENCIA PERSONAL 1</div>
            <button onClick={() => set('showRef1', !showRef1)} style={{ padding: '5px 14px', fontSize: 11, fontWeight: 'bold', cursor: 'pointer', borderRadius: 4, border: `1px solid ${showRef1 ? 'rgba(201,168,76,0.6)' : 'rgba(201,168,76,0.25)'}`, background: showRef1 ? 'rgba(201,168,76,0.15)' : 'transparent', color: showRef1 ? C.gold : C.muted, fontFamily: 'Arial, sans-serif', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
              {showRef1 ? '▲ Ocultar' : '▼ Agregar'}
            </button>
          </div>
          <div style={{ marginBottom: 16 }} />
          {showRef1 && (
            <>
              <Row2>
                <Field fkey="ref1Name"  label="Name / Nombre" placeholder="Nombre completo" value={f('ref1Name')} onChange={set} />
                <Field fkey="ref1Phone" label="Phone / Teléfono" placeholder="+52 322 000 0000" value={f('ref1Phone')} onChange={set} type="tel" />
              </Row2>
              <Row2>
                <Field fkey="ref1Email"   label="Email" placeholder="email@ejemplo.com" value={f('ref1Email')} onChange={set} type="email" />
                <Field fkey="ref1Address" label="Address / Domicilio" placeholder="Domicilio completo" value={f('ref1Address')} onChange={set} />
              </Row2>
            </>
          )}

          {/* ── 8. REFERENCIA 2 — toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0 0' }}>
            <div style={{ ...S.secHdr, margin: 0, flex: 1 }}>8. PERSONAL REFERENCE 2 / REFERENCIA PERSONAL 2</div>
            <button onClick={() => set('showRef2', !showRef2)} style={{ padding: '5px 14px', fontSize: 11, fontWeight: 'bold', cursor: 'pointer', borderRadius: 4, border: `1px solid ${showRef2 ? 'rgba(201,168,76,0.6)' : 'rgba(201,168,76,0.25)'}`, background: showRef2 ? 'rgba(201,168,76,0.15)' : 'transparent', color: showRef2 ? C.gold : C.muted, fontFamily: 'Arial, sans-serif', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
              {showRef2 ? '▲ Ocultar' : '▼ Agregar'}
            </button>
          </div>
          <div style={{ marginBottom: 16 }} />
          {showRef2 && (
            <>
              <Row2>
                <Field fkey="ref2Name"  label="Name / Nombre" placeholder="Nombre completo" value={f('ref2Name')} onChange={set} />
                <Field fkey="ref2Phone" label="Phone / Teléfono" placeholder="+52 322 000 0000" value={f('ref2Phone')} onChange={set} type="tel" />
              </Row2>
              <Row2>
                <Field fkey="ref2Email"   label="Email" placeholder="email@ejemplo.com" value={f('ref2Email')} onChange={set} type="email" />
                <Field fkey="ref2Address" label="Address / Domicilio" placeholder="Domicilio completo" value={f('ref2Address')} onChange={set} />
              </Row2>
            </>
          )}

          {/* ── 9. FORMATO BÁSICO MIGRACIÓN — solo extranjeros, toggle */}
          {isForeign && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0 0' }}>
                <div style={{ ...S.secHdr, margin: 0, flex: 1, background: '#2C1B4E' }}>
                  9. FORMATO BÁSICO — MIGRACIÓN / INM BASIC FORM
                </div>
                <button onClick={() => set('showMigracion', !showMigracion)} style={{ padding: '5px 14px', fontSize: 11, fontWeight: 'bold', cursor: 'pointer', borderRadius: 4, border: `1px solid ${showMigracion ? 'rgba(180,120,255,0.6)' : 'rgba(180,120,255,0.25)'}`, background: showMigracion ? 'rgba(180,120,255,0.12)' : 'transparent', color: showMigracion ? '#C084FC' : C.muted, fontFamily: 'Arial, sans-serif', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
                  {showMigracion ? '▲ Ocultar' : '▼ Agregar'}
                </button>
              </div>
              <div style={{ marginBottom: 16 }} />
            </>
          )}

          {isForeign && showMigracion && (
            <>
              {/* Datos personales complementarios */}
              <div style={{ fontSize: 10, color: C.dim, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Datos personales / Personal data</div>
              <Row2>
                <Field fkey="sexo" label="Sexo / Sex" type="select"
                  options={['', 'Masculino / Male', 'Femenino / Female']}
                  value={f('sexo')} onChange={set} />
                <Field fkey="numHijos" label="Número de hijos / No. of Children" placeholder="0" value={f('numHijos')} onChange={set} />
              </Row2>
              <Row2>
                <Field fkey="idiomaMaterno" label="Idioma materno / Native Language" placeholder="Ej. English, Français" value={f('idiomaMaterno')} onChange={set} />
                <Field fkey="hablaEspanol" label="¿Habla español? / Speaks Spanish?" type="select"
                  options={['', 'Sí / Yes', 'No', 'Básico / Basic']}
                  value={f('hablaEspanol')} onChange={set} />
              </Row2>
              <Row2>
                <Field fkey="religion" label="Religión / Religion" placeholder="Ej. Catholic, None / Ninguna" value={f('religion')} onChange={set} />
                <Field fkey="raza" label="Raza / Race" type="select"
                  options={['', 'Blanca / White', 'Amarilla / Asian', 'Negra / Black', 'Nativa / Indigenous', 'Mestiza / Mixed']}
                  value={f('raza')} onChange={set} />
              </Row2>
              <Row2>
                <Field fkey="escolaridad" label="Nivel de estudios / Education Level" type="select"
                  options={["", "Sin estudios / None", "Primaria / Elementary", "Secundaria / Middle School", "Preparatoria / High School", "Licenciatura / Bachelor's", "Maestría / Master's", "Doctorado / PhD", "Posgrado / Postgraduate"]}
                  value={f('escolaridad')} onChange={set} />
                <Field fkey="areaConocimiento" label="Área de conocimiento / Field of Study" placeholder="Ej. Law, Engineering, Medicine" value={f('areaConocimiento')} onChange={set} />
              </Row2>

              {/* Media filiación con convertidores */}
              <div style={{ fontSize: 10, color: C.dim, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '12px 0 10px' }}>Media filiación / Physical description</div>

              {/* ESTATURA — convertidor ft/in → metros */}
              <div style={{ marginBottom: 14 }}>
                <label style={S.label}>Estatura / Height</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, alignItems: 'end' }}>
                  <div>
                    <label style={{ ...S.label, fontSize: 10, color: C.dim }}>Feet / Pies</label>
                    <input style={S.input} type="number" min="3" max="8" placeholder="5"
                      value={data.heightFt || ''}
                      onChange={e => {
                        const ft = e.target.value
                        set('heightFt', ft)
                        const m = feetInchesToMeters(ft, data.heightIn || 0)
                        if (m) set('estatura', m)
                      }} />
                  </div>
                  <div>
                    <label style={{ ...S.label, fontSize: 10, color: C.dim }}>Inches / Pulgadas</label>
                    <input style={S.input} type="number" min="0" max="11" placeholder="10"
                      value={data.heightIn || ''}
                      onChange={e => {
                        const inches = e.target.value
                        set('heightIn', inches)
                        const m = feetInchesToMeters(data.heightFt || 0, inches)
                        if (m) set('estatura', m)
                      }} />
                  </div>
                  <div>
                    <label style={{ ...S.label, fontSize: 10, color: C.goldBright }}>→ Metros (INM)</label>
                    <input style={{ ...S.input, borderColor: 'rgba(201,168,76,0.4)', color: C.gold }} type="text" placeholder="1.78"
                      value={f('estatura')}
                      onChange={e => set('estatura', e.target.value)} />
                  </div>
                  <div>
                    <Field fkey="complexion" label="Complexión / Build" type="select"
                      options={['', 'Delgada / Slim', 'Mediana / Medium', 'Robusta / Heavy']}
                      value={f('complexion')} onChange={set} />
                  </div>
                </div>
              </div>

              {/* PESO — convertidor lbs → kg */}
              <div style={{ marginBottom: 14 }}>
                <label style={S.label}>Peso / Weight</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, alignItems: 'end' }}>
                  <div>
                    <label style={{ ...S.label, fontSize: 10, color: C.dim }}>Pounds / Libras</label>
                    <input style={S.input} type="number" min="50" max="600" placeholder="175"
                      value={data.weightLbs || ''}
                      onChange={e => {
                        const lbs = e.target.value
                        set('weightLbs', lbs)
                        const kg = lbsToKg(lbs)
                        if (kg) set('peso', kg)
                      }} />
                  </div>
                  <div>
                    <label style={{ ...S.label, fontSize: 10, color: C.goldBright }}>→ Kilograms / Kg (INM)</label>
                    <input style={{ ...S.input, borderColor: 'rgba(201,168,76,0.4)', color: C.gold }} type="text" placeholder="79.4"
                      value={f('peso')}
                      onChange={e => set('peso', e.target.value)} />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <Field fkey="senas" label="Señas particulares / Distinguishing marks" placeholder="Ej. Scar on left hand / Tatuaje en brazo derecho" value={f('senas')} onChange={set} />
                  </div>
                </div>
              </div>

              {/* Lugar de residencia anterior */}
              <div style={{ fontSize: 10, color: C.dim, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '12px 0 10px' }}>Lugar de residencia anterior / Prior residence</div>
              <Row2>
                <Field fkey="paisResidenciaAnterior" label="País de residencia antes de México / Country before Mexico" placeholder="Ej. United States, Canada" value={f('paisResidenciaAnterior')} onChange={set} />
                <Field fkey="tipoPoblacion" label="Tipo de población / Type of area" type="select"
                  options={['', 'Ciudad / City', 'Suburbio / Suburb', 'Pueblo / Town', 'Aldea / Village', 'Caserío / Hamlet']}
                  value={f('tipoPoblacion')} onChange={set} />
              </Row2>
              <Row2>
                <Field fkey="nombrePoblacion" label="Nombre de la población / City or Town" placeholder="Ej. Seattle, Calgary" value={f('nombrePoblacion')} onChange={set} />
                <Field fkey="estadoProvincia" label="Estado / Provincia / Province or State" placeholder="Ej. Washington, British Columbia" value={f('estadoProvincia')} onChange={set} />
              </Row2>

              {/* Datos laborales en país de origen */}
              <div style={{ fontSize: 10, color: C.dim, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '12px 0 10px' }}>Datos laborales en país de origen / Work data in home country</div>
              <Row2>
                <Field fkey="actividadPrincipal" label="Actividad principal / Primary activity" type="select"
                  options={['', 'Trabajar / Working', 'Estudiar / Studying', 'Hogar / Homemaker', 'Jubilado / Retired', 'Ministro de culto / Minister', 'Rentista / Investor', 'Desempleado / Unemployed']}
                  value={f('actividadPrincipal')} onChange={set} />
                <Field fkey="ingresoMensualUSD" label="Ingreso mensual neto (USD) / Monthly net income (USD)" placeholder="Ej. 3500" value={f('ingresoMensualUSD')} onChange={set} />
              </Row2>
              {(f('actividadPrincipal') || '').includes('Trabajar') && (
                <>
                  <Row2>
                    <Field fkey="sectorTrabajo" label="Sector / Rama de trabajo" type="select"
                      options={['', 'Agropecuario / Agriculture', 'Minería / Mining', 'Construcción / Construction', 'Industria manufacturera / Manufacturing', 'Comercio / Commerce', 'Transportes / Transportation', 'Servicios educativos / Education', 'Servicios de salud / Health', 'Servicios personales / Personal services', 'Gobierno / Government', 'Tecnología / Technology', 'Otro / Other']}
                      value={f('sectorTrabajo')} onChange={set} />
                    <Field fkey="situacionTrabajo" label="Situación en el trabajo / Employment type" type="select"
                      options={['', 'Empleado / Employee', 'Jornalero / Day laborer', 'Patrón / Employer', 'Independiente / Self-employed', 'Sin pago / Unpaid family worker', 'Otro / Other']}
                      value={f('situacionTrabajo')} onChange={set} />
                  </Row2>
                  <Row1>
                    <Field fkey="ocupacionTrabajo" label="Ocupación / Occupation type" type="select"
                      options={['', 'Profesionista o técnico / Professional or technical', 'Directivo / Executive', 'Administrativo / Administrative', 'Comerciante / Sales', 'Servicios / Services', 'Agropecuario / Agricultural', 'Industrial / Industrial', 'Otro / Other']}
                      value={f('ocupacionTrabajo')} onChange={set} />
                  </Row1>
                </>
              )}

              {/* Información laboral en México */}
              <div style={{ fontSize: 10, color: C.dim, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '12px 0 10px' }}>Información laboral en México / Work info in Mexico</div>
              <Row2>
                <Field fkey="anosExpMexico" label="Años de experiencia laboral en México / Years of work exp. in Mexico" placeholder="0" value={f('anosExpMexico')} onChange={set} />
                <Field fkey="periodoContratacion" label="Período de contratación (meses) / Contract period (months)" placeholder="12" value={f('periodoContratacion')} onChange={set} />
              </Row2>
            </>
          )}

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

      <footer style={S.footer}>GeneralesGen v1.2  |  Expat Advisor MX  |  La Colmena 2026</footer>
    </div>
  )
}
