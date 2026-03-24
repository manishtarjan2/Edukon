import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import './globals.css'

export const metadata = {
  title: 'Edukon',
  description: 'Join Your Dream College',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-800">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
