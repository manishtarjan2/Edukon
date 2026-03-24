export default function ContactPage() {
    return (
        <div className="min-h-screen py-20" style={{ background: 'linear-gradient(to bottom, #fef8f0, #f5e6d3)' }}>
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-block mb-4">
                        <span className="handwritten text-3xl text-amber-700">We'd love to hear from you</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: '#3d2f1f' }}>
                        Contact Us
                    </h1>
                    <p className="text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: '#5a4a3a' }}>
                        Have questions about your journey? We're here to help guide you every step of the way.
                    </p>
                </div>

                {/* Contact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
                    {/* Email Card */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-amber-100 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="text-5xl mb-4 text-center">📧</div>
                        <h3 className="text-xl font-bold mb-2 text-center" style={{ color: '#3d2f1f' }}>
                            Email Us
                        </h3>
                        <p className="text-center mb-4" style={{ color: '#5a4a3a' }}>
                            Send us a message anytime
                        </p>
                        <div className="text-center">
                            <a
                                href="mailto:info@edukon.edu"
                                className="text-amber-700 hover:text-amber-900 font-semibold transition-colors inline-block px-4 py-2 bg-amber-50 rounded-lg hover:bg-amber-100"
                            >
                                info@edukon.edu
                            </a>
                        </div>
                    </div>

                    {/* Phone Card */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-amber-100 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="text-5xl mb-4 text-center">📞</div>
                        <h3 className="text-xl font-bold mb-2 text-center" style={{ color: '#3d2f1f' }}>
                            Call Us
                        </h3>
                        <p className="text-center mb-4" style={{ color: '#5a4a3a' }}>
                            Available Mon-Fri, 9am-6pm
                        </p>
                        <div className="text-center">
                            <a
                                href="tel:+15551234567"
                                className="text-amber-700 hover:text-amber-900 font-semibold transition-colors inline-block px-4 py-2 bg-amber-50 rounded-lg hover:bg-amber-100"
                            >
                                +1 (555) 123-4567
                            </a>
                        </div>
                    </div>

                    {/* Location Card */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-amber-100 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="text-5xl mb-4 text-center">📍</div>
                        <h3 className="text-xl font-bold mb-2 text-center" style={{ color: '#3d2f1f' }}>
                            Visit Us
                        </h3>
                        <p className="text-center mb-4" style={{ color: '#5a4a3a' }}>
                            Come say hello
                        </p>
                        <div className="text-center text-amber-700 font-semibold">
                            <p>123 Education Street</p>
                            <p>Learning City, ED 12345</p>
                        </div>
                    </div>
                </div>

                {/* Additional Info Box */}
                <div className="max-w-3xl mx-auto bg-white rounded-3xl p-10 shadow-2xl border-4 border-amber-100 relative">
                    {/* Decorative corners */}
                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-amber-400 rounded-full"></div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-orange-400 rounded-full"></div>

                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4" style={{ color: '#3d2f1f' }}>
                            💛 We're Here to Help
                        </h2>
                        <p className="text-lg leading-relaxed mb-6" style={{ color: '#5a4a3a' }}>
                            Whether you have questions about admissions, need guidance on choosing a program,
                            or just want to learn more about Edukon, our team is always ready to support you.
                        </p>
                        <p className="handwritten text-2xl text-amber-700">
                            Your dreams matter to us ✨
                        </p>
                    </div>
                </div>

                {/* Back to Home Link */}
                <div className="text-center mt-12">
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-white"
                        style={{ background: 'linear-gradient(135deg, #d4851c 0%, #f59e0b 100%)' }}
                    >
                        ← Back to Home
                    </a>
                </div>
            </div>
        </div>
    )
}
