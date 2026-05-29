import { NextResponse } from 'next/server'
import { T as i18nT } from '../../i18n'
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
} from 'docx'

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
        new TextRun({ text: 'CUSTOMER GENERAL INFORMATION', font: FONT, size: 28, bold: true, color: DARK }),
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
      const value = data[key] || ''
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
      children: [new TextRun({ text: '  Declaration / Declaración:', font: FONT, size: 16, bold: true, color: DARK })],
    }),
    new Paragraph({
      spacing: { before: 8, after: 100 },
      children: [new TextRun({
        text: 'I declare under penalty of perjury that all information provided herein is true and correct. / Declaro bajo protesta de decir verdad que toda la información aquí proporcionada es verídica y correcta.',
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
                children: [new TextRun({ text: 'DATE / FECHA', font: FONT, size: 14, color: GRAY, bold: true })],
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
                children: [new TextRun({ text: 'NAME AND SIGNATURE / NOMBRE Y FIRMA', font: FONT, size: 14, color: GRAY, bold: true })],
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
