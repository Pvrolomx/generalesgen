export const metadata = {
  title: 'GeneralesGen — Expat Advisor MX',
  description: 'Generador de ficha de generales para clientes inmobiliarios. Expat Advisor MX.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0, background: '#080F1A', color: '#F5F0E8', fontFamily: 'Arial, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
