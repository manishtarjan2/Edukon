export default function AboutPage() {
    return (
        <div className="min-h-screen py-20" style={{ background: 'linear-gradient(to bottom, #fef8f0, #f5e6d3)' }}>
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-block mb-4">
                        <span className="handwritten text-3xl text-amber-700">Our story</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: '#3d2f1f' }}>
                        About Edukon
                    </h1>
                </div>

                {/* Main Content Card */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-3xl p-12 shadow-2xl border-4 border-amber-100 relative mb-12">
                        {/* Decorative corners */}
                        <div className="absolute -top-3 -left-3 w-8 h-8 bg-amber-400 rounded-full"></div>
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-orange-400 rounded-full"></div>
                        <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-amber-300 rounded-full"></div>
                        <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-orange-300 rounded-full"></div>

                        {/* Heartfelt message */}
                        <div className="text-center mb-12">
                            <p className="handwritten text-4xl text-amber-600 mb-6">
                                Thank you for dreaming with us
                            </p>
                            <p className="text-xl leading-relaxed mb-8" style={{ color: '#5a4a3a' }}>
                                Every student who joins our community adds a unique spark to our story.
                                Your dreams inspire us, and we're honored to walk this path beside you.
                            </p>
                        </div>

                        {/* Vintage divider */}
                        <div className="flex items-center justify-center mb-12">
                            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
                            <div className="mx-4 text-amber-500 text-2xl">✦</div>
                            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
                        </div>

                        {/* Brand Info */}
                        <div className="text-center mb-8">
                            <h2 className="text-4xl font-bold mb-4" style={{ color: '#3d2f1f' }}>
                                Edukon
                            </h2>
                            <p className="text-2xl font-semibold mb-6 text-amber-600">
                                Join Your Dream College
                            </p>
                            <p className="text-lg leading-relaxed" style={{ color: '#5a4a3a' }}>
                                More than a platform, we're a community of dreamers helping dreamers.
                                Since our beginning, we've believed that every student deserves the chance
                                to pursue their passion and create their own extraordinary story.
                            </p>
                        </div>
                    </div>

                    {/* Our Mission */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-10 border-2 border-amber-200 mb-12">
                        <h3 className="text-3xl font-bold mb-6 text-center" style={{ color: '#3d2f1f' }}>
                            💛 Our Mission
                        </h3>
                        <p className="text-lg leading-relaxed text-center max-w-2xl mx-auto" style={{ color: '#5a4a3a' }}>
                            We believe that choosing a college isn't just about rankings or prestige—it's about
                            finding the right fit for YOUR unique journey. We're here to guide, support, and empower
                            you to make the choice that's right for your dreams, not someone else's expectations.
                        </p>
                    </div>

                    {/* Closing Message */}
                    <div className="text-center">
                        <p className="handwritten text-3xl text-amber-700 mb-6">
                            Your journey starts here, but where it takes you... that's your story to write. ✨
                        </p>
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
        </div>
    )
}
