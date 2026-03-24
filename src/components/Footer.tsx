export default function Footer() {
    return (
        <footer className="relative overflow-hidden" style={{
            background: 'linear-gradient(to bottom, #3d2f1f, #2a1f1a)'
        }}>
            <div className="container mx-auto px-4 py-8 relative z-10">
                {/* Navigation Links */}
                <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm">
                    <a href="/" className="text-amber-200/70 hover:text-amber-100 transition-colors font-medium">
                        🏠 Home
                    </a>
                    <span className="text-amber-700">•</span>
                    <a href="/about" className="text-amber-200/70 hover:text-amber-100 transition-colors font-medium">
                        💛 About
                    </a>
                    <span className="text-amber-700">•</span>
                    <a href="/contact" className="text-amber-200/70 hover:text-amber-100 transition-colors font-medium">
                        📞 Contact
                    </a>
                    <span className="text-amber-700">•</span>
                    <a href="/login" className="text-amber-200/70 hover:text-amber-100 transition-colors font-medium">
                        👤 Student Login
                    </a>
                    <span className="text-amber-700">•</span>
                    <a href="/admin/login" className="text-amber-200/70 hover:text-amber-100 transition-colors font-medium">
                        🔐 Admin
                    </a>
                </div>

                {/* Copyright */}
                <div className="text-center">
                    <p className="text-amber-200/60 text-sm">
                        &copy; {new Date().getFullYear()} Edukon. Crafted with 💛 for dreamers, by dreamers.
                    </p>
                </div>
            </div>

            {/* Decorative bottom accent */}
            <div className="h-1 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600"></div>
        </footer>
    )
}
