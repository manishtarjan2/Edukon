import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden" style={{
      background: 'linear-gradient(135deg, #fef8f0 0%, #f5e6d3 50%, #fff9f0 100%)'
    }}>
      {/* Vintage paper texture overlay */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noiseFilter)\' opacity=\'0.05\'/%3E%3C/svg%3E")'
      }}></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Emotional Content */}
          <div className="text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 border border-amber-200 text-amber-800 font-medium text-sm">
              ✨ Where Dreams Take Flight
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight" style={{ color: '#3d2f1f' }}>
              Your Dreams{' '}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">
                  Deserve Wings
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                  <path d="M0 4C50 8 150 0 200 4" stroke="#d4851c" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed" style={{ color: '#5a4a3a' }}>
              Every great journey begins with a single step. Whether you're pursuing your passion or
              discovering a new path, <span className="font-semibold text-amber-700">your college story starts here</span>.
              Let us help you write the chapters that matter.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/register">
                <button className="px-8 py-4 rounded-xl font-semibold text-lg text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #d4851c 0%, #f59e0b 100%)' }}>
                  Begin Your Story 📖
                </button>
              </Link>
              <Link href="/admin/login">
                <button className="px-8 py-4 rounded-xl font-semibold text-lg border-2 border-amber-300 bg-white text-amber-800 hover:bg-amber-50 transition-all duration-300">
                  Admin Portal
                </button>
              </Link>
            </div>

            {/* Handwritten note feel */}
            <div className="mt-8 p-4 bg-yellow-50/50 border-l-4 border-amber-400 rounded-r-lg">
              <p className="handwritten text-xl text-amber-900">
                "The future belongs to those who believe in the beauty of their dreams"
              </p>
              <p className="text-sm text-amber-700 mt-1">— Eleanor Roosevelt</p>
            </div>
          </div>

          {/* Right: Nostalgic Illustration */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-8 border-white" style={{
              boxShadow: '0 20px 60px rgba(212, 133, 28, 0.2)'
            }}>
              <img
                src="/hero-dreams.png"
                alt="Students reaching for their dreams"
                className="w-full h-auto"
              />
            </div>
            {/* Decorative corner elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 border-4 border-amber-400 rounded-full opacity-50"></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-amber-200 rounded-full opacity-50"></div>
          </div>
        </div>

        {/* Trusted by section with vintage feel */}
        <div className="mt-20 text-center">
          <p className="text-sm uppercase tracking-wider text-amber-700 mb-6 font-semibold">
            Trusted by Students Joining Premier Institutions
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 hover:opacity-100 transition-opacity duration-500">
            <img src="https://upload.wikimedia.org/wikipedia/en/thumb/f/f9/Indian_Institute_of_Technology_Delhi_Logo.svg/1200px-Indian_Institute_of_Technology_Delhi_Logo.svg.png" className="h-12 object-contain filter sepia-[0.3]" alt="IIT Delhi" />
            <img src="https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/Indian_Institute_of_Technology_Bombay_Logo.svg/1200px-Indian_Institute_of_Technology_Bombay_Logo.svg.png" className="h-12 object-contain filter sepia-[0.3]" alt="IIT Bombay" />
            <img src="https://upload.wikimedia.org/wikipedia/en/thumb/6/69/IIT_Madras_Logo.svg/1200px-IIT_Madras_Logo.svg.png" className="h-12 object-contain filter sepia-[0.3]" alt="IIT Madras" />
            <img src="https://upload.wikimedia.org/wikipedia/en/thumb/a/ad/IIT_Kanpur_Logo.svg/1200px-IIT_Kanpur_Logo.svg.png" className="h-12 object-contain filter sepia-[0.3]" alt="IIT Kanpur" />
          </div>
        </div>
      </div>
    </section>
  )
}
