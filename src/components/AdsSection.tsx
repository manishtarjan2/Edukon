export default function AdsSection() {
    const ads = [
        {
            title: "Early Bird Special",
            description: "Register now and save 20% on admission fees. Limited time offer!",
            image: "🎓",
            buttonText: "Register Now",
            bgColor: "from-green-400 to-emerald-500"
        },
        {
            title: "Scholarship Available",
            description: "Merit-based scholarships covering up to 100% tuition. Apply today!",
            image: "💰",
            buttonText: "Apply Now",
            bgColor: "from-blue-400 to-indigo-500"
        },
        {
            title: "Campus Tours",
            description: "Experience campus life firsthand. Free tours every Saturday!",
            image: "🏫",
            buttonText: "Book Tour",
            bgColor: "from-purple-400 to-pink-500"
        },
        {
            title: "Career Counseling",
            description: "Get expert guidance on choosing the right career path for you.",
            image: "🎯",
            buttonText: "Get Help",
            bgColor: "from-orange-400 to-red-500"
        }
    ]

    return (
        <section className="py-20" style={{ background: 'linear-gradient(to bottom, #fff9f0, #fef8f0)' }}>
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4" style={{ color: '#3d2f1f' }}>
                        Special Offers & Opportunities
                    </h2>
                    <p className="text-lg" style={{ color: '#5a4a3a' }}>
                        Don't miss out on these exclusive opportunities
                    </p>
                </div>

                {/* Ad Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {ads.map((ad, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-amber-100 hover:border-amber-300"
                        >
                            {/* Icon/Image */}
                            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${ad.bgColor} flex items-center justify-center text-3xl mb-4 shadow-md`}>
                                {ad.image}
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold mb-3" style={{ color: '#3d2f1f' }}>
                                {ad.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm mb-4 leading-relaxed" style={{ color: '#5a4a3a' }}>
                                {ad.description}
                            </p>

                            {/* CTA Button */}
                            <button
                                className={`w-full py-3 rounded-xl font-semibold text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-r ${ad.bgColor}`}
                            >
                                {ad.buttonText} →
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
