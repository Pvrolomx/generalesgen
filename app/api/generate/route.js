import { NextResponse } from 'next/server'
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
} from 'docx'

// docx depends on Node APIs; pin the route to the Node.js runtime (not Edge).
export const runtime = 'nodejs'


// ─── INLINE i18n (ES / EN / FR) ──────────────────────────────────────
const TRANSLATIONS = {
  sec1: { es:'1. INFORMACIÓN PERSONAL', en:'1. PERSONAL INFORMATION', fr:'1. INFORMATIONS PERSONNELLES' },
  sec2: { es:'2. DOCUMENTOS DE IDENTIFICACIÓN', en:'2. IDENTIFICATION DOCUMENTS', fr:"2. DOCUMENTS D'IDENTIFICATION" },
  sec3: { es:'3. IDENTIFICADORES FISCALES', en:'3. TAX IDENTIFIERS', fr:'3. IDENTIFIANTS FISCAUX' },
  sec4: { es:'4. INFORMACIÓN DE CONTACTO', en:'4. CONTACT INFORMATION', fr:'4. COORDONNÉES' },
  sec5: { es:'5. DOMICILIO', en:'5. ADDRESS', fr:'5. ADRESSE' },
  sec6: { es:'6. OCUPACIÓN / EMPRESA', en:'6. OCCUPATION / COMPANY', fr:'6. PROFESSION / ENTREPRISE' },
  sec7: { es:'7. REFERENCIA PERSONAL 1', en:'7. PERSONAL REFERENCE 1', fr:'7. RÉFÉRENCE PERSONNELLE 1' },
  sec8: { es:'8. REFERENCIA PERSONAL 2', en:'8. PERSONAL REFERENCE 2', fr:'8. RÉFÉRENCE PERSONNELLE 2' },
  sec9: { es:'9. FORMATO BÁSICO — MIGRACIÓN / INM', en:'9. INM BASIC FORM — MIGRATION', fr:'9. FORMULAIRE DE BASE — MIGRATION / INM' },
  firstName:       { es:'Nombre(s)', en:'First Name(s)', fr:'Prénom(s)' },
  lastName:        { es:'Apellido(s)', en:'Last Name(s)', fr:'Nom(s) de famille' },
  dob:             { es:'Fecha de Nacimiento', en:'Date of Birth', fr:'Date de naissance' },
  pob:             { es:'Lugar de Nacimiento', en:'Place of Birth', fr:'Lieu de naissance' },
  nationality:     { es:'Nacionalidad', en:'Nationality', fr:'Nationalité' },
  maritalStatus:   { es:'Estado Civil', en:'Marital Status', fr:'État civil' },
  maritalRegime:   { es:'Régimen Matrimonial', en:'Marital Regime', fr:'Régime matrimonial' },
  idType:          { es:'Tipo de Identificación', en:'ID Type', fr:"Type d'identification" },
  idNumber:        { es:'Número de Documento', en:'ID Number', fr:'Numéro de document' },
  idIssued:        { es:'Fecha de Emisión', en:'Date Issued', fr:'Date de délivrance' },
  idExpiry:        { es:'Fecha de Vencimiento', en:'Expiration Date', fr:"Date d'expiration" },
  idIssuingAuth:   { es:'Autoridad Emisora', en:'Issuing Authority', fr:'Autorité émettrice' },
  legalStatus:     { es:'Condición Migratoria en México', en:'Legal Status in Mexico', fr:'Statut migratoire au Mexique' },
  migraDocNumber:  { es:'No. Documento Migratorio', en:'Migration Document No.', fr:'No. document migratoire' },
  curpLabel:       { es:'CURP', en:'CURP', fr:'CURP' },
  rfcLabel:        { es:'RFC', en:'RFC', fr:'RFC' },
  ssnUS:           { es:'Núm. Seguro Social (SSN)', en:'Social Security Number (SSN)', fr:"Numéro d'assurance (SSN)" },
  email:           { es:'Correo electrónico', en:'Email', fr:'Courriel' },
  cellPhone:       { es:'Celular', en:'Cell Phone', fr:'Cellulaire' },
  homePhone:       { es:'Tel. Casa', en:'Home Phone', fr:'Tél. domicile' },
  addressMX:       { es:'Domicilio en México', en:'Address in Mexico', fr:'Adresse au Mexique' },
  addressAbroad:   { es:'Domicilio en el Extranjero', en:'Address Abroad', fr:"Adresse à l'étranger" },
  employmentStatus:{ es:'Situación Laboral', en:'Employment Status', fr:'Situation professionnelle' },
  occupationDetail:{ es:'Ocupación', en:'Occupation', fr:'Profession' },
  position:        { es:'Puesto', en:'Position', fr:'Poste' },
  companyName:     { es:'Nombre de la Empresa', en:'Company Name', fr:"Nom de l'entreprise" },
  companyType:     { es:'Tipo de Empresa', en:'Type of Company', fr:"Type d'entreprise" },
  companyPhone:    { es:'Tel. Empresa', en:'Company Phone', fr:'Tél. entreprise' },
  companyAddress:  { es:'Domicilio Empresa', en:'Company Address', fr:"Adresse de l'entreprise" },
  refName:         { es:'Nombre', en:'Name', fr:'Nom' },
  refPhone:        { es:'Teléfono', en:'Phone', fr:'Téléphone' },
  refAddress:      { es:'Domicilio', en:'Address', fr:'Adresse' },
  sexo:            { es:'Sexo', en:'Sex', fr:'Sexe' },
  numHijos:        { es:'Número de hijos', en:'No. of Children', fr:"Nombre d'enfants" },
  idiomaMaterno:   { es:'Idioma materno', en:'Native Language', fr:'Langue maternelle' },
  hablaEspanol:    { es:'¿Habla español?', en:'Speaks Spanish?', fr:'Parle espagnol?' },
  religion:        { es:'Religión', en:'Religion', fr:'Religion' },
  raza:            { es:'Raza', en:'Race', fr:'Race' },
  escolaridad:     { es:'Nivel de estudios', en:'Education Level', fr:"Niveau d'études" },
  areaConocimiento:{ es:'Área de conocimiento', en:'Field of Study', fr:"Domaine d'études" },
  labelEstatura:   { es:'Estatura (m)', en:'Height (m)', fr:'Taille (m)' },
  complexion:      { es:'Complexión', en:'Build', fr:'Corpulence' },
  labelPeso:       { es:'Peso (kg)', en:'Weight (kg)', fr:'Poids (kg)' },
  senas:           { es:'Señas particulares', en:'Distinguishing marks', fr:'Signes particuliers' },
  paisAnterior:    { es:'País de residencia anterior', en:'Prior country of residence', fr:'Pays de résidence antérieur' },
  tipoPoblacion:   { es:'Tipo de población', en:'Type of area', fr:'Type de localité' },
  nombrePoblacion: { es:'Nombre de la ciudad/pueblo', en:'City or Town', fr:'Ville ou bourg' },
  estadoProvincia: { es:'Estado / Provincia', en:'State or Province', fr:'État ou Province' },
  actividadPrincipal:{ es:'Actividad principal', en:'Primary activity', fr:'Activité principale' },
  ingresoUSD:      { es:'Ingreso mensual neto (USD)', en:'Monthly net income (USD)', fr:'Revenu mensuel net (USD)' },
  sectorTrabajo:   { es:'Sector de trabajo', en:'Work sector', fr:"Secteur d'activité" },
  situacionTrabajo:{ es:'Situación en el trabajo', en:'Employment type', fr:'Situation professionnelle' },
  ocupacionTrabajo:{ es:'Tipo de ocupación', en:'Occupation type', fr:"Type d'occupation" },
  anosExp:         { es:'Años exp. laboral en México', en:'Work exp. years in Mexico', fr:"Années d'expérience au Mexique" },
  periodoContrat:  { es:'Período de contratación (meses)', en:'Contract period (months)', fr:'Période de contrat (mois)' },
  // ── FIXED DOCUMENT STRINGS (institutional text only; Rolo's fixed data
  //    — cédula, name, URL — stays inline in the builder, untranslated)
  docTitle:  {
    es:'INFORMACIÓN GENERAL DEL CLIENTE',
    en:'CUSTOMER GENERAL INFORMATION',
    fr:'INFORMATIONS GÉNÉRALES DU CLIENT',
  },
  declLabel: { es:'Declaración:', en:'Declaration:', fr:'Déclaration:' },
  declText:  {
    es:'Declaro bajo protesta de decir verdad que toda la información aquí proporcionada es verídica y correcta.',
    en:'I declare under penalty of perjury that all information provided herein is true and correct.',
    fr:'Je déclare sous peine de parjure que toutes les informations fournies dans le présent document sont véridiques et exactes.',
  },
  sigDate:   { es:'FECHA', en:'DATE', fr:'DATE' },
  sigName:   { es:'NOMBRE Y FIRMA', en:'NAME AND SIGNATURE', fr:'NOM ET SIGNATURE' },
}
function i18nT(key, lang) {
  const l = lang || 'es'
  return TRANSLATIONS[key]?.[l] ?? TRANSLATIONS[key]?.['es'] ?? key
}

// ─── PAGE SETUP (A4) ─────────────────────────────────────────────────
const PAGE_W     = 11906
const PAGE_H     = 16838
const MARGIN     = 1080
const CONTENT_W  = PAGE_W - MARGIN * 2   // 9746 DXA
const COL_LABEL  = 2900
const COL_VALUE  = CONTENT_W - COL_LABEL

// ─── COLORS ──────────────────────────────────────────────────────────
const DARK   = '0D1F35'
const MID    = '1B3A5C'
const LIGHT  = 'D6E4F0'
const GOLD   = 'C9A84C'
const GRAY   = '4A5568'
const LINE   = 'AABBCC'
const WHITE  = 'FFFFFF'
const FONT   = 'Arial'

// ─── BORDER HELPERS ──────────────────────────────────────────────────
const none = { style: BorderStyle.NONE, size: 0, color: WHITE }
const noBorder = () => ({ top: none, bottom: none, left: none, right: none })
const bottomBorder = () => ({
  top: none, left: none, right: none,
  bottom: { style: BorderStyle.SINGLE, size: 4, color: LINE },
})

// ─── FIELD LABELS ────────────────────────────────────────────────────
// Per-language label maps — keyed by field key, value is i18n key in i18n.js
// Fallback: show raw i18n key if not mapped
const LABEL_MAP = {
  firstName:         'firstName',
  lastName:          'lastName',
  fullName:          'firstName',  // built label
  dob:               'dob',
  pob:               'pob',
  nationality:       'nationality',
  maritalStatus:     'maritalStatus',
  maritalRegime:     'maritalRegime',
  idType:            'idType',
  idNumber:          'idNumber',
  idIssued:          'idIssued',
  idExpiry:          'idExpiry',
  idIssuingAuth:     'idIssuingAuth',
  legalStatus:       'legalStatus',
  migraDocNumber:    'migraDocNumber',
  curp:              'curpLabel',
  rfc:               'rfcLabel',
  ssn:               'ssnUS',
  email:             'email',
  cellPhone:         'cellPhone',
  homePhone:         'homePhone',
  addressMX:         'addressMX',
  addressAbroad:     'addressAbroad',
  occupation:        'employmentStatus',
  occupationDetail:  'occupationDetail',
  positionInCompany: 'position',
  companyName:       'companyName',
  companyType:       'companyType',
  companyPhone:      'companyPhone',
  companyAddress:    'companyAddress',
  sexo:                   'sexo',
  numHijos:               'numHijos',
  idiomaMaterno:          'idiomaMaterno',
  hablaEspanol:           'hablaEspanol',
  religion:               'religion',
  raza:                   'raza',
  escolaridad:            'escolaridad',
  areaConocimiento:       'areaConocimiento',
  estatura:               'labelEstatura',
  complexion:             'complexion',
  peso:                   'labelPeso',
  senas:                  'senas',
  paisResidenciaAnterior: 'paisAnterior',
  tipoPoblacion:          'tipoPoblacion',
  nombrePoblacion:        'nombrePoblacion',
  estadoProvincia:        'estadoProvincia',
  actividadPrincipal:     'actividadPrincipal',
  ingresoMensualUSD:      'ingresoUSD',
  sectorTrabajo:          'sectorTrabajo',
  situacionTrabajo:       'situacionTrabajo',
  ocupacionTrabajo:       'ocupacionTrabajo',
  anosExpMexico:          'anosExp',
  periodoContratacion:    'periodoContrat',
  ref1Name:          'refName',
  ref1Phone:         'refPhone',
  ref1Email:         'email',
  ref1Address:       'refAddress',
  ref2Name:          'refName',
  ref2Phone:         'refPhone',
  ref2Email:         'email',
  ref2Address:       'refAddress',
}

// ─── VALUE LABELS ────────────────────────────────────────────────────
// Translates internal select VALUES (stored crudos: 'Married','SepProp','INE'…)
// to human-readable text per language. Unmapped values print as-is (safe fallback).
// Note: 'Other'/'Agro' codes are shared across sector/situacion/ocupacion fields;
// their text is equivalent, so a single flat map is safe.
const VALUE_LABELS = {
  // nationality
  Mexicana:    { es:'Mexicana', en:'Mexican', fr:'Mexicaine' },
  American:    { es:'Estadounidense', en:'American', fr:'Américain(e)' },
  Canadian:    { es:'Canadiense', en:'Canadian', fr:'Canadien(ne)' },
  Other:       { es:'Otra', en:'Other', fr:'Autre' },
  // maritalStatus
  Single:      { es:'Soltero(a)', en:'Single', fr:'Célibataire' },
  Married:     { es:'Casado(a)', en:'Married', fr:'Marié(e)' },
  Divorced:    { es:'Divorciado(a)', en:'Divorced', fr:'Divorcé(e)' },
  Widowed:     { es:'Viudo(a)', en:'Widowed', fr:'Veuf/Veuve' },
  CommonLaw:   { es:'Unión libre', en:'Common Law', fr:'Union de fait' },
  // maritalRegime
  SepProp:     { es:'Bienes Separados', en:'Separate Property', fr:'Séparation de biens' },
  CommProp:    { es:'Sociedad Conyugal', en:'Community Property', fr:'Communauté de biens' },
  // idType
  INE:         { es:'INE / IFE', en:'INE / IFE', fr:'INE / IFE' },
  Passport:    { es:'Pasaporte', en:'Passport', fr:'Passeport' },
  License:     { es:'Licencia de Conducir', en:"Driver's License", fr:'Permis de conduire' },
  Resident:    { es:'Tarjeta de Residencia', en:'Resident Card', fr:'Carte de résident' },
  // legalStatus
  Tourist:     { es:'Turista (FMM)', en:'Tourist (FMM)', fr:'Touriste (FMM)' },
  RT:          { es:'Residente Temporal', en:'Temporary Resident', fr:'Résident temporaire' },
  RP:          { es:'Residente Permanente', en:'Permanent Resident', fr:'Résident permanent' },
  // occupation (employment status)
  Employed:    { es:'Empleado', en:'Employed', fr:'Employé(e)' },
  Retired:     { es:'Jubilado', en:'Retired', fr:'Retraité(e)' },
  Unemployed:  { es:'Desempleado', en:'Unemployed', fr:'Sans emploi' },
  // sexo
  M:           { es:'Masculino', en:'Male', fr:'Masculin' },
  F:           { es:'Femenino', en:'Female', fr:'Féminin' },
  // hablaEspanol
  Si:          { es:'Sí', en:'Yes', fr:'Oui' },
  No:          { es:'No', en:'No', fr:'Non' },
  Basico:      { es:'Básico', en:'Basic', fr:'Basique' },
  // raza
  Blanca:      { es:'Blanca', en:'White', fr:'Blanche' },
  Amarilla:    { es:'Amarilla (Asiática)', en:'Asian', fr:'Asiatique' },
  Negra:       { es:'Negra', en:'Black', fr:'Noire' },
  Nativa:      { es:'Nativa / Indígena', en:'Indigenous', fr:'Autochtone' },
  Mestiza:     { es:'Mestiza', en:'Mixed', fr:'Métis(se)' },
  // escolaridad
  None:        { es:'Sin estudios', en:'No formal education', fr:'Sans études' },
  Prim:        { es:'Primaria', en:'Elementary', fr:'Primaire' },
  Sec:         { es:'Secundaria', en:'Middle School', fr:'Collège' },
  Prep:        { es:'Preparatoria / Bachillerato', en:'High School', fr:'Lycée / Baccalauréat' },
  Lic:         { es:'Licenciatura', en:"Bachelor's", fr:'Licence' },
  Mae:         { es:'Maestría', en:"Master's", fr:'Master' },
  Doc:         { es:'Doctorado', en:'PhD', fr:'Doctorat' },
  Pos:         { es:'Posgrado', en:'Postgraduate', fr:'Post-graduate' },
  // complexion
  Delgada:     { es:'Delgada', en:'Slim', fr:'Mince' },
  Mediana:     { es:'Mediana', en:'Medium', fr:'Moyenne' },
  Robusta:     { es:'Robusta', en:'Heavy', fr:'Robuste' },
  // tipoPoblacion
  Ciudad:      { es:'Ciudad', en:'City', fr:'Ville' },
  Suburbio:    { es:'Suburbio', en:'Suburb', fr:'Banlieue' },
  Pueblo:      { es:'Pueblo', en:'Town', fr:'Bourg' },
  Aldea:       { es:'Aldea', en:'Village', fr:'Village' },
  Caserio:     { es:'Caserío', en:'Hamlet', fr:'Hameau' },
  // actividadPrincipal
  Working:     { es:'Trabajar', en:'Working', fr:'Travail' },
  Studying:    { es:'Estudiar', en:'Studying', fr:'Études' },
  Hogar:       { es:'Hogar', en:'Homemaker', fr:'Foyer' },
  Minister:    { es:'Ministro de culto', en:'Minister', fr:'Ministre du culte' },
  Investor:    { es:'Rentista', en:'Investor', fr:'Rentier(ère)' },
  // sectorTrabajo
  Agro:        { es:'Agropecuario', en:'Agriculture', fr:'Agriculture' },
  Mining:      { es:'Minería', en:'Mining', fr:'Mines' },
  Constr:      { es:'Construcción', en:'Construction', fr:'Construction' },
  Manuf:       { es:'Manufactura', en:'Manufacturing', fr:'Fabrication' },
  Commerce:    { es:'Comercio', en:'Commerce', fr:'Commerce' },
  Transport:   { es:'Transportes', en:'Transportation', fr:'Transports' },
  Edu:         { es:'Servicios educativos', en:'Education', fr:'Éducation' },
  Health:      { es:'Salud', en:'Health', fr:'Santé' },
  Tech:        { es:'Tecnología', en:'Technology', fr:'Technologie' },
  Gov:         { es:'Gobierno', en:'Government', fr:'Gouvernement' },
  // situacionTrabajo
  Employee:    { es:'Empleado', en:'Employee', fr:'Employé(e)' },
  Patron:      { es:'Patrón', en:'Employer', fr:'Employeur' },
  Independent: { es:'Independiente', en:'Self-employed', fr:'Indépendant(e)' },
  DayLabor:    { es:'Jornalero', en:'Day laborer', fr:'Journalier' },
  // ocupacionTrabajo
  Prof:        { es:'Profesionista', en:'Professional', fr:'Professionnel(le)' },
  Exec:        { es:'Directivo', en:'Executive', fr:'Cadre dirigeant' },
  Admin:       { es:'Administrativo', en:'Administrative', fr:'Administratif' },
  Sales:       { es:'Comerciante', en:'Sales', fr:'Commerçant(e)' },
  Services:    { es:'Servicios', en:'Services', fr:'Services' },
  Industrial:  { es:'Industrial', en:'Industrial', fr:'Industriel' },
}
function resolveValue(value, lang) {
  if (value == null) return ''
  const v = String(value).trim()
  if (!v) return ''
  const entry = VALUE_LABELS[v]
  if (!entry) return v               // safe fallback: print as-is
  return entry[lang] ?? entry['es'] ?? v
}

// ─── SECTION GROUPING ────────────────────────────────────────────────
const SECTIONS = [
  {
    titleKey: 'sec1',
    keys: ['fullName', 'dob', 'pob', 'nationality', 'maritalStatus', 'maritalRegime'],
  },
  {
    titleKey: 'sec2',
    keys: ['idType', 'idNumber', 'idIssued', 'idExpiry', 'idIssuingAuth', 'legalStatus', 'migraDocNumber'],
  },
  {
    titleKey: 'sec3',
    keys: ['curp', 'rfc', 'ssn'],
  },
  {
    titleKey: 'sec4',
    keys: ['email', 'cellPhone', 'homePhone'],
  },
  {
    titleKey: 'sec5',
    keys: ['addressMX', 'addressAbroad'],
  },
  {
    titleKey: 'sec6',
    keys: ['occupation', 'occupationDetail', 'positionInCompany', 'companyName', 'companyType', 'companyPhone', 'companyAddress'],
    optional: false,
  },
  {
    titleKey: 'sec9',
    keys: ['sexo','numHijos','idiomaMaterno','hablaEspanol','religion','raza','escolaridad','areaConocimiento',
           'estatura','complexion','peso','senas',
           'paisResidenciaAnterior','tipoPoblacion','nombrePoblacion','estadoProvincia',
           'actividadPrincipal','ingresoMensualUSD','sectorTrabajo','situacionTrabajo','ocupacionTrabajo',
           'anosExpMexico','periodoContratacion'],
    optional: true,
  },
  {
    titleKey: 'sec7',
    keys: ['ref1Name', 'ref1Phone', 'ref1Email', 'ref1Address'],
    optional: true,
  },
  {
    titleKey: 'sec8',
    keys: ['ref2Name', 'ref2Phone', 'ref2Email', 'ref2Address'],
    optional: true,
  },
]

// ─── BUILDERS ────────────────────────────────────────────────────────

function sectionHeader(title) {
  return new Paragraph({
    spacing: { before: 200, after: 80 },
    shading: { fill: MID, type: ShadingType.CLEAR },
    children: [
      new TextRun({ text: '  ' + title, font: FONT, size: 20, bold: true, color: WHITE }),
    ],
  })
}

function fieldRow(label, value, shade) {
  const fill = shade ? LIGHT : WHITE
  const m = { top: 80, bottom: 80, left: 140, right: 100 }
  const isEmpty = !value || !String(value).trim()

  return new TableRow({
    children: [
      new TableCell({
        width: { size: COL_LABEL, type: WidthType.DXA },
        borders: bottomBorder(),
        shading: { fill, type: ShadingType.CLEAR },
        margins: m,
        verticalAlign: VerticalAlign.BOTTOM,
        children: [new Paragraph({
          spacing: { before: 0, after: 0 },
          children: [new TextRun({ text: label, font: FONT, size: 16, color: GRAY, bold: true })],
        })],
      }),
      new TableCell({
        width: { size: COL_VALUE, type: WidthType.DXA },
        borders: bottomBorder(),
        shading: { fill, type: ShadingType.CLEAR },
        margins: m,
        verticalAlign: VerticalAlign.BOTTOM,
        children: [new Paragraph({
          spacing: { before: 0, after: 0 },
          children: [new TextRun({
            text: isEmpty ? ' ' : String(value),
            font: FONT,
            size: 18,
            color: isEmpty ? 'CCCCCC' : '111111',
            italics: isEmpty,
          })],
        })],
      }),
    ],
  })
}

function dataTable(rows) {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [COL_LABEL, COL_VALUE],
    borders: noBorder(),
    rows,
  })
}

function spacer(pts = 80) {
  return new Paragraph({
    spacing: { before: 0, after: pts },
    children: [new TextRun({ text: '', font: FONT, size: 8 })],
  })
}

// ─── MAIN BUILDER ────────────────────────────────────────────────────

function buildDocument(data, lang) {
  const TT = (key) => i18nT(key, lang)
  const getLabel = (key) => TT(LABEL_MAP[key]) || key

  const today = new Date().toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const children = []

  // ── TITLE BLOCK
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 60 },
      children: [
        new TextRun({ text: TT('docTitle'), font: FONT, size: 28, bold: true, color: DARK }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 20 },
      children: [
        new TextRun({ text: 'Expat Advisor MX  |  Lic. Rolando Romero García  |  expatadvisormx.com', font: FONT, size: 14, color: GOLD }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 0 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: GOLD, space: 1 } },
      children: [new TextRun({ text: '', font: FONT, size: 6 })],
    }),
    spacer(80),
  )

  // ── FILE INFO (date + name)
  children.push(
    dataTable([
      fieldRow('Date / Fecha', today, false),
      fieldRow('Client / Cliente', data.fullName || '', true),
    ]),
    spacer(60),
  )

  // ── SECTIONS
  SECTIONS.forEach((sec) => {
    // Skip optional sections if all fields are empty
    if (sec.optional) {
      const hasData = sec.keys.some(k => data[k] && String(data[k]).trim())
      if (!hasData) return
    }
    children.push(sectionHeader(TT(sec.titleKey)))

    const rows = sec.keys.map((key, idx) => {
      const label = getLabel(key)
      const value = resolveValue(data[key] || '', lang)
      return fieldRow(label, value, idx % 2 === 1)
    })

    children.push(dataTable(rows), spacer(40))
  })

  // ── SIGNATURE BLOCK
  children.push(
    spacer(120),
    new Paragraph({
      spacing: { before: 0, after: 60 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: DARK, space: 1 } },
      children: [new TextRun({ text: '  ' + TT('declLabel'), font: FONT, size: 16, bold: true, color: DARK })],
    }),
    new Paragraph({
      spacing: { before: 8, after: 100 },
      children: [new TextRun({
        text: TT('declText'),
        font: FONT, size: 14, color: GRAY, italics: true,
      })],
    }),
    spacer(100),

    // Signature lines
    new Table({
      width: { size: CONTENT_W, type: WidthType.DXA },
      columnWidths: [
        Math.floor(CONTENT_W * 0.35),
        Math.floor(CONTENT_W * 0.08),
        Math.floor(CONTENT_W * 0.57),
      ],
      borders: noBorder(),
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: Math.floor(CONTENT_W * 0.35), type: WidthType.DXA },
              borders: { ...noBorder(), bottom: { style: BorderStyle.SINGLE, size: 6, color: DARK } },
              margins: { top: 0, bottom: 60, left: 0, right: 0 },
              children: [new Paragraph({ children: [new TextRun({ text: ' ', font: FONT, size: 18 })] })],
            }),
            new TableCell({
              width: { size: Math.floor(CONTENT_W * 0.08), type: WidthType.DXA },
              borders: noBorder(),
              children: [new Paragraph({ children: [new TextRun({ text: ' ' })] })],
            }),
            new TableCell({
              width: { size: Math.floor(CONTENT_W * 0.57), type: WidthType.DXA },
              borders: { ...noBorder(), bottom: { style: BorderStyle.SINGLE, size: 6, color: DARK } },
              margins: { top: 0, bottom: 60, left: 0, right: 0 },
              children: [new Paragraph({ children: [new TextRun({ text: ' ', font: FONT, size: 18 })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: Math.floor(CONTENT_W * 0.35), type: WidthType.DXA },
              borders: noBorder(),
              margins: { top: 40, bottom: 0, left: 0, right: 0 },
              children: [new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: TT('sigDate'), font: FONT, size: 14, color: GRAY, bold: true })],
              })],
            }),
            new TableCell({
              width: { size: Math.floor(CONTENT_W * 0.08), type: WidthType.DXA },
              borders: noBorder(),
              children: [new Paragraph({ children: [new TextRun({ text: ' ' })] })],
            }),
            new TableCell({
              width: { size: Math.floor(CONTENT_W * 0.57), type: WidthType.DXA },
              borders: noBorder(),
              margins: { top: 40, bottom: 0, left: 0, right: 0 },
              children: [new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: TT('sigName'), font: FONT, size: 14, color: GRAY, bold: true })],
              })],
            }),
          ],
        }),
      ],
    }),
    spacer(80),

    // Footer note
    new Paragraph({
      spacing: { before: 40, after: 0 },
      border: { top: { style: BorderStyle.SINGLE, size: 6, color: GOLD, space: 4 } },
      children: [
        new TextRun({
          text: 'Expat Advisor MX  |  Lic. Rolando Romero García  |  Cédula Prof. 5255863  |  expatadvisormx.com  |  Puerto Vallarta / Riviera Nayarit',
          font: FONT, size: 13, color: '888888', italics: true,
        }),
      ],
    }),
  )

  return new Document({
    sections: [{
      properties: {
        page: {
          size: { width: PAGE_W, height: PAGE_H },
          margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
        },
      },
      children,
    }],
  })
}

// ─── ROUTE HANDLER ───────────────────────────────────────────────────
export async function POST(request) {
  try {
    const data = await request.json()
    const lang = data.lang || 'es'
    const doc = buildDocument(data, lang)
    const buffer = await Packer.toBuffer(doc)

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename="GENERALES.docx"',
      },
    })
  } catch (err) {
    console.error('GeneralesGen error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
