import { NextResponse } from 'next/server'
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
// Maps data key → display label (bilingual)
const FIELD_LABELS = {
  fullName:          'Full Name / Nombre Completo',
  dob:               'Date of Birth / Fecha de Nacimiento',
  pob:               'Place of Birth / Lugar de Nacimiento',
  nationality:       'Nationality / Nacionalidad',
  maritalStatus:     'Marital Status / Estado Civil',
  maritalRegime:     'Marital Regime / Régimen Matrimonial',
  idType:            'ID Type / Tipo de Identificación',
  idNumber:          'ID Number / Número',
  idIssued:          'Date Issued / Fecha de Emisión',
  idExpiry:          'Expiration / Vencimiento',
  idIssuingAuth:     'Issuing Authority / Autoridad Emisora',
  curp:              'CURP',
  rfc:               'RFC',
  ssn:               'SSN (US) / SIN (Canada)',
  email:             'Email',
  cellPhone:         'Cell Phone / Celular',
  homePhone:         'Home Phone / Tel. Casa',
  addressMX:         'Address in Mexico / Domicilio en México',
  addressAbroad:     'Address Abroad / Domicilio Extranjero',
  occupation:        'Occupation / Ocupación',
  positionInCompany: 'Position / Puesto',
  companyName:       'Company / Empresa',
  companyType:       'Type of Company / Tipo de Empresa',
  companyPhone:      'Company Phone / Tel. Empresa',
  companyAddress:    'Company Address / Domicilio Empresa',
}

// ─── SECTION GROUPING ────────────────────────────────────────────────
const SECTIONS = [
  {
    title: '1. PERSONAL INFORMATION',
    keys: ['fullName', 'dob', 'pob', 'nationality', 'maritalStatus', 'maritalRegime'],
  },
  {
    title: '2. IDENTIFICATION DOCUMENT',
    keys: ['idType', 'idNumber', 'idIssued', 'idExpiry', 'idIssuingAuth'],
  },
  {
    title: '3. TAX IDENTIFIERS',
    keys: ['curp', 'rfc', 'ssn'],
  },
  {
    title: '4. CONTACT',
    keys: ['email', 'cellPhone', 'homePhone'],
  },
  {
    title: '5. ADDRESS / DOMICILIO',
    keys: ['addressMX', 'addressAbroad'],
  },
  {
    title: '6. OCCUPATION / EMPRESA',
    keys: ['occupation', 'positionInCompany', 'companyName', 'companyType', 'companyPhone', 'companyAddress'],
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

function buildDocument(data) {
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
    // Only include section if at least one field has data (or always show for structure)
    children.push(sectionHeader(sec.title))

    const rows = sec.keys.map((key, idx) => {
      const label = FIELD_LABELS[key] || key
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
    const doc = buildDocument(data)
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
