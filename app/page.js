'use client'
import { useState } from 'react'

// ─── THEME ───────────────────────────────────────────────────────────
const C = {
  bg:       '#080F1A',
  bgCard:   '#0E1B2E',
  bgInput:  '#111E30',
  bgHover:  '#162540',
  border:   'rgba(201,168,76,0.2)',
  borderFocus: 'rgba(201,168,76,0.6)',
  gold:     '#C9A84C',
  goldBright:'#E8C96A',
  cream:    '#F5F0E8',
  muted:    'rgba(245,240,232,0.45)',
  dim:      'rgba(245,240,232,0.25)',
  section:  '#1B3A5C',
  error:    '#E74C3C',
  success:  '#27AE60',
}

// ─── FIELD DEFINITIONS ───────────────────────────────────────────────
// type: text | date | select | tel | email | section-header
const FIELDS = [
  { key: '_sec_personal', type: 'section', label: 'PERSONAL INFORMATION' },
  { key: 'fullName',        label: 'Full Name / Nombre Completo',         placeholder: 'APELLIDO(S), Nombre(s)', required: true },
  { key: 'dob',             label: 'Date of Birth / Fecha de Nacimiento', placeholder: 'DD/MM/YYYY', type: 'date-text' },
  { key: 'pob',             label: 'Place of Birth / Lugar de Nacimiento',placeholder: 'Ciudad, País' },
  { key: 'nationality',     label: 'Nationality / Nacionalidad',           placeholder: 'Ej. Mexicana / American / Canadian' },
  { key: 'maritalStatus',   label: 'Marital Status / Estado Civil',
    type: 'select',
    options: ['', 'Single / Soltero(a)', 'Married / Casado(a)', 'Divorced / Divorciado(a)', 'Widowed / Viudo(a)', 'Common Law / Unión libre'],
  },
  { key: 'maritalRegime',   label: 'Marital Regime (if married) / Régimen Matrimonial',
    type: 'select',
    options: ['', 'N/A', 'Separate Property / Bienes Separados', 'Community Property / Sociedad Conyugal'],
    dependsOn: { key: 'maritalStatus', includes: 'Married' },
  },

  { key: '_sec_ids', type: 'section', label: 'IDENTIFICATION DOCUMENTS' },
  { key: 'idType',          label: 'Primary ID Type',
    type: 'select',
    options: ['', 'Passport / Pasaporte', 'INE / IFE', 'Resident Card / Tarjeta de Residencia', 'Driver\'s License / Licencia de Conducir'],
  },
  { key: 'idNumber',        label: 'ID Number / Número de Identificación', placeholder: 'Ej. A63887765 / IDMEX1834017910' },
  { key: 'idIssued',        label: 'Date Issued / Fecha de Emisión',       placeholder: 'DD/MM/YYYY o YYYY' },
  { key: 'idExpiry',        label: 'Expiration Date / Fecha de Vencimiento',placeholder: 'DD/MM/YYYY o YYYY' },
  { key: 'idIssuingAuth',   label: 'Issuing Authority / Autoridad Emisora', placeholder: 'Ej. United States Government / INE' },

  { key: '_sec_tax', type: 'section', label: 'TAX IDENTIFIERS' },
  { key: 'curp',            label: 'CURP',  placeholder: 'CASC781111MDFSTL01 (Mexicanos/Residentes)' },
  { key: 'rfc',             label: 'RFC',   placeholder: 'CASC781111F20 (Mexicanos/Residentes)' },
  { key: 'ssn',             label: 'Social Security Number (US) / SIN (Canada)', placeholder: 'XXX-XX-XXXX  o  NNN NNN NNN' },

  { key: '_sec_contact', type: 'section', label: 'CONTACT INFORMATION' },
  { key: 'email',           label: 'Email', placeholder: 'cliente@ejemplo.com', type: 'email' },
  { key: 'cellPhone',       label: 'Cell Phone / Celular (incl. código int\'l)', placeholder: '+1 555 123 4567 / +52 322 000 0000', type: 'tel' },
  { key: 'homePhone',       label: 'Home Phone / Tel. Casa',                  placeholder: '+1 555 000 0000', type: 'tel' },

  { key: '_sec_address', type: 'section', label: 'ADDRESS / DOMICILIO' },
  { key: 'addressMX',       label: 'Address in Mexico / Domicilio en México', placeholder: 'Calle, número, colonia, municipio, estado, C.P.', type: 'textarea' },
  { key: 'addressAbroad',   label: 'Address Abroad / Domicilio en el Extranjero', placeholder: 'Street, City, State, ZIP, Country', type: 'textarea' },

  { key: '_sec_occupation', type: 'section', label: 'OCCUPATION / EMPRESA' },
  { key: 'occupation',      label: 'Occupation / Ocupación', placeholder: 'Ej. Retired / Retirado, Empresario, Médico' },
  { key: 'positionInCompany', label: 'Position / Puesto en la Empresa', placeholder: 'Ej. Owner / Dueño, Director General, Gerente' },
  { key: 'companyName',     label: 'Company Name / Nombre de la Empresa', placeholder: 'Ej. Castle Solutions (PVCASTLEMX SAS DE CV)' },
  { key: 'companyType',     label: 'Type of Company / Tipo de Empresa', placeholder: 'Ej. Property Management / Administradora de Propiedades' },
  { key: 'companyPhone',    label: 'Company Phone / Teléfono de la Empresa', placeholder: '+52 322 000 0000', type: 'tel' },
  { key: 'companyAddress',  label: 'Company Address / Domicilio de la Empresa', placeholder: 'Dirección completa', type: 'textarea' },

  { key: '_sec_ref1', type: 'section', label: 'PERSONAL REFERENCE 1 / REFERENCIA PERSONAL 1 (Optional)' },
  { key: 'ref1Name',    label: 'Name / Nombre', placeholder: 'Nombre completo' },
  { key: 'ref1Phone',   label: 'Phone / Teléfono', placeholder: '+52 322 000 0000', type: 'tel' },
  { key: 'ref1Email',   label: 'Email', placeholder: 'email@ejemplo.com', type: 'email' },
  { key: 'ref1Address', label: 'Address / Domicilio', placeholder: 'Domicilio completo', type: 'textarea' },

  { key: '_sec_ref2', type: 'section', label: 'PERSONAL REFERENCE 2 / REFERENCIA PERSONAL 2 (Optional)' },
  { key: 'ref2Name',    label: 'Name / Nombre', placeholder: 'Nombre completo' },
  { key: 'ref2Phone',   label: 'Phone / Teléfono', placeholder: '+52 322 000 0000', type: 'tel' },
  { key: 'ref2Email',   label: 'Email', placeholder: 'email@ejemplo.com', type: 'email' },
  { key: 'ref2Address', label: 'Address / Domicilio', placeholder: 'Domicilio completo', type: 'textarea' },
]

// ─── STYLES ──────────────────────────────────────────────────────────
const S = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: C.bg,
  },
  header: {
    background: 'rgba(8,15,26,0.98)',
    borderBottom: `1px solid ${C.border}`,
    padding: '14px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  main: {
    flex: 1,
    padding: '32px 20px',
    maxWidth: 760,
    width: '100%',
    margin: '0 auto',
  },
  card: {
    background: C.bgCard,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    padding: '20px 24px',
    marginBottom: 16,
  },
  sectionHeader: {
    background: C.section,
    borderRadius: 6,
    padding: '10px 16px',
    marginBottom: 16,
    marginTop: 8,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: '0.12em',
    color: C.goldBright,
  },
  label: {
    display: 'block',
    fontSize: 11,
    fontWeight: 'bold',
    color: C.muted,
    letterSpacing: '0.06em',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    background: C.bgInput,
    border: `1px solid rgba(201,168,76,0.15)`,
    borderRadius: 4,
    padding: '9px 12px',
    fontSize: 13,
    color: C.cream,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'Arial, sans-serif',
    transition: 'border-color 0.15s',
  },
  textarea: {
    width: '100%',
    background: C.bgInput,
    border: `1px solid rgba(201,168,76,0.15)`,
    borderRadius: 4,
    padding: '9px 12px',
    fontSize: 13,
    color: C.cream,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'Arial, sans-serif',
    resize: 'vertical',
    minHeight: 64,
  },
  select: {
    width: '100%',
    background: C.bgInput,
    border: `1px solid rgba(201,168,76,0.15)`,
    borderRadius: 4,
    padding: '9px 12px',
    fontSize: 13,
    color: C.cream,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'Arial, sans-serif',
    appearance: 'none',
    cursor: 'pointer',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 14,
  },
  btnPrimary: {
    padding: '11px 28px',
    background: `linear-gradient(135deg, rgba(201,168,76,0.3), rgba(201,168,76,0.15))`,
    border: `1px solid rgba(201,168,76,0.6)`,
    borderRadius: 5,
    color: C.gold,
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: '0.06em',
    cursor: 'pointer',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  btnSecondary: {
    padding: '10px 20px',
    background: 'transparent',
    border: `1px solid ${C.border}`,
    borderRadius: 5,
    color: C.muted,
    fontSize: 12,
    cursor: 'pointer',
    fontFamily: 'Arial, sans-serif',
  },
  footer: {
    borderTop: `1px solid ${C.border}`,
    padding: '14px 24px',
    textAlign: 'center',
    fontSize: 11,
    color: C.dim,
    background: 'rgba(8,15,26,0.9)',
  },
}

// ─── FIELD COMPONENT ────────────────────────────────────────────────
function Field({ field, value, onChange, hidden }) {
  if (hidden) return null

  const inputStyle = { ...S.input }
  const handleFocus = (e) => { e.target.style.borderColor = C.borderFocus }
  const handleBlur  = (e) => { e.target.style.borderColor = 'rgba(201,168,76,0.15)' }

  if (field.type === 'textarea') {
    return (
      <div>
        <label style={S.label}>{field.label}{field.required && <span style={{ color: C.gold }}> *</span>}</label>
        <textarea
          style={S.textarea}
          placeholder={field.placeholder || ''}
          value={value || ''}
          onChange={(e) => onChange(field.key, e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          rows={3}
        />
      </div>
    )
  }

  if (field.type === 'select') {
    return (
      <div>
        <label style={S.label}>{field.label}</label>
        <div style={{ position: 'relative' }}>
          <select
            style={S.select}
            value={value || ''}
            onChange={(e) => onChange(field.key, e.target.value)}
          >
            {field.options.map(opt => <option key={opt} value={opt}>{opt || '— Select —'}</option>)}
          </select>
          <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: C.gold, pointerEvents: 'none', fontSize: 10 }}>▼</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      <label style={S.label}>{field.label}{field.required && <span style={{ color: C.gold }}> *</span>}</label>
      <input
        style={inputStyle}
        type={field.type === 'date-text' ? 'text' : (field.type || 'text')}
        placeholder={field.placeholder || ''}
        value={value || ''}
        onChange={(e) => onChange(field.key, e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  )
}

// ─── LAYOUT: pair fields into 2-col grid ─────────────────────────────
// Consecutive non-section, non-textarea fields get paired into grids of 2
function renderFields(fields, data, onChange) {
  const elements = []
  let i = 0
  while (i < fields.length) {
    const f = fields[i]

    if (f.type === 'section') {
      elements.push(<div key={f.key} style={S.sectionHeader}>{f.label}</div>)
      i++
      continue
    }

    // Check visibility
    const hidden = f.dependsOn
      ? !((data[f.dependsOn.key] || '').includes(f.dependsOn.includes))
      : false

    // Textarea or email: full width
    if (f.type === 'textarea' || f.type === 'email') {
      elements.push(
        <div key={f.key} style={{ marginBottom: 14 }}>
          <Field field={f} value={data[f.key]} onChange={onChange} hidden={hidden} />
        </div>
      )
      i++
      continue
    }

    // Try to pair with next field (if also pairlable)
    const next = fields[i + 1]
    const nextHidden = next?.dependsOn
      ? !((data[next?.dependsOn?.key] || '').includes(next?.dependsOn?.includes))
      : false

    const canPair = next
      && next.type !== 'section'
      && next.type !== 'textarea'
      && next.type !== 'email'
      && !hidden && !nextHidden

    if (canPair) {
      elements.push(
        <div key={`pair-${f.key}`} style={{ ...S.grid2, marginBottom: 14 }}>
          <Field field={f}    value={data[f.key]}    onChange={onChange} />
          <Field field={next} value={data[next.key]} onChange={onChange} />
        </div>
      )
      i += 2
    } else {
      elements.push(
        <div key={f.key} style={{ marginBottom: 14 }}>
          <Field field={f} value={data[f.key]} onChange={onChange} hidden={hidden} />
        </div>
      )
      i++
    }
  }
  return elements
}

// ─── GENERATE DOCX ───────────────────────────────────────────────────
async function generateDOCX(data) {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error generando DOCX')
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const name = (data.fullName || 'CLIENTE').replace(/[^A-Z0-9]/gi, '_').toUpperCase().slice(0, 20)
  a.href = url
  a.download = `GENERALES_${name}.docx`
  a.click()
  URL.revokeObjectURL(url)
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────
export default function GeneralesGen() {
  const [data, setData] = useState({})
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const handleChange = (key, val) => {
    setData(prev => ({ ...prev, [key]: val }))
    setSaved(false)
  }

  const handleGenerate = async () => {
    if (!data.fullName?.trim()) {
      setError('Full Name / Nombre Completo es requerido.')
      return
    }
    setError('')
    setGenerating(true)
    try {
      await generateDOCX(data)
    } catch (e) {
      setError('Error generando el documento. Intenta de nuevo.')
    }
    setGenerating(false)
  }

  const handleSaveJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const name = (data.fullName || 'cliente').replace(/[^A-Z0-9]/gi, '_').toLowerCase()
    a.href = url
    a.download = `generales_${name}.json`
    a.click()
    URL.revokeObjectURL(url)
    setSaved(true)
  }

  const handleLoadJSON = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const loaded = JSON.parse(ev.target.result)
          setData(loaded)
          setSaved(true)
        } catch {
          setError('Archivo JSON inválido.')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const handleClear = () => {
    if (confirm('¿Limpiar todos los campos?')) {
      setData({})
      setSaved(false)
      setError('')
    }
  }

  const filledCount = Object.values(data).filter(v => v && String(v).trim()).length
  const totalFields = FIELDS.filter(f => f.type !== 'section').length

  return (
    <div style={S.page}>

      {/* HEADER */}
      <header style={S.header}>
        <div>
          <div style={{
            fontSize: 20, fontWeight: 'bold', letterSpacing: '0.05em',
            background: `linear-gradient(90deg, ${C.gold}, ${C.goldBright}, ${C.gold})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>GeneralesGen</div>
          <div style={{ fontSize: 10, color: C.dim, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Expat Advisor MX — Ficha de Generales
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button style={S.btnSecondary} onClick={handleLoadJSON}>↑ Cargar</button>
          <button style={S.btnSecondary} onClick={handleSaveJSON}>
            {saved ? '✓ Guardado' : '↓ Guardar'}
          </button>
          <button style={{ ...S.btnSecondary, color: 'rgba(231,76,60,0.6)', borderColor: 'rgba(231,76,60,0.3)' }} onClick={handleClear}>
            Limpiar
          </button>
        </div>
      </header>

      {/* PROGRESS BAR */}
      <div style={{ background: 'rgba(14,27,46,0.8)', borderBottom: `1px solid ${C.border}`, padding: '12px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ flex: 1, height: 4, background: 'rgba(201,168,76,0.1)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.round((filledCount / totalFields) * 100)}%`,
              background: `linear-gradient(90deg, ${C.gold}, ${C.goldBright})`,
              borderRadius: 2,
              transition: 'width 0.3s ease',
            }} />
          </div>
          <div style={{ fontSize: 11, color: C.muted, whiteSpace: 'nowrap' }}>
            {filledCount} / {totalFields} campos
          </div>
        </div>
      </div>

      {/* MAIN FORM */}
      <main style={S.main}>

        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, color: C.gold, margin: '0 0 6px', fontFamily: 'Georgia, serif' }}>
            Ficha de Generales del Cliente
          </h2>
          <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
            Llena los campos disponibles. Guarda el JSON para reutilizar con el mismo cliente.
            Los campos vacíos aparecen como línea en blanco en el documento.
          </p>
        </div>

        <div style={S.card}>
          {renderFields(FIELDS, data, handleChange)}
        </div>

        {error && (
          <div style={{
            background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)',
            borderRadius: 6, padding: '10px 16px', marginBottom: 16,
            fontSize: 13, color: '#E74C3C',
          }}>
            ⚠ {error}
          </div>
        )}

        {/* ACTIONS */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8 }}>
          <button style={S.btnSecondary} onClick={handleSaveJSON}>
            ↓ Guardar borrador JSON
          </button>
          <button
            style={{ ...S.btnPrimary, opacity: generating ? 0.6 : 1 }}
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? '⏳ Generando...' : '⬇ Descargar DOCX'}
          </button>
        </div>

        {/* NOTA */}
        <div style={{
          marginTop: 24,
          padding: '12px 16px',
          background: 'rgba(27,58,92,0.3)',
          borderLeft: `3px solid ${C.gold}`,
          borderRadius: 4,
          fontSize: 11,
          color: C.dim,
          lineHeight: 1.6,
        }}>
          <strong style={{ color: C.muted }}>Escalabilidad:</strong> Para agregar nuevos campos (testigo, RFC empresa, número de escritura, etc.)
          basta con añadir una entrada al array <code style={{ color: C.gold }}>FIELDS</code> en el código.
          El formulario y el DOCX se actualizan automáticamente.
        </div>

      </main>

      <footer style={S.footer}>
        GeneralesGen v1.0 &nbsp;|&nbsp; Expat Advisor MX &nbsp;|&nbsp; La Colmena 2026
      </footer>
    </div>
  )
}
