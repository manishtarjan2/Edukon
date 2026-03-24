export default function FeaturedSlider() {
    const colleges = [
        {
            name: 'College of Engineering',
            tagline: 'Est. 1872 - A Future Built on Tradition',
            description: 'Build tomorrow\'s innovations. From concept to creation, engineering shapes the future under golden autumn skies.',
            image: '/engineering_college_nostalgic_1769949189586.png',
            gradient: 'from-amber-400 to-orange-500'
        },
        {
            name: 'Mercy Medical College',
            tagline: 'A Place of Healing',
            description: 'Healing hearts, transforming lives. The journey to becoming a healer starts here among cherry blossoms.',
            image: '/medical_college_nostalgic_1769949206591.png',
            gradient: 'from-rose-400 to-pink-500'
        },
        {
            name: 'Arts & Business College',
            tagline: 'Est. 1920 - Creativity & Commerce',
            description: 'Your creativity, your vision, your empire. Where passion meets profession in a vibrant creative community.',
            image: '/arts_college_nostalgic_1769949224888.png',
            gradient: 'from-purple-400 to-indigo-500'
        }
    ]

    return (
        <section className="py-20 relative" style={{ background: 'linear-gradient(to bottom, #fef8f0, #fff9f0)' }}>
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-block mb-4">
                        <span className="handwritten text-2xl text-amber-700">Every path tells a story</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#3d2f1f' }}>
                        Featured{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">
                            Colleges
                        </span>
                    </h2>
                    <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#5a4a3a' }}>
                        Discover your dream college. Each campus has its own unique story and spirit.
                    </p>
                </div>

                {/* College Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {colleges.map((college, index) => (
                        <div key={index} className="group relative">
                            {/* Vintage postcard style card */}
                            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-4 border-amber-100 hover:border-amber-300 relative">
                                {/* College Image */}
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={college.image}
                                        alt={college.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {/* Vintage overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                                    {/* Decorative stamp */}
                                    <div className="absolute top-4 right-4 w-16 h-16 rounded-full border-4 border-dashed border-white bg-white/90 flex items-center justify-center text-2xl backdrop-blur-sm">
                                        {index === 0 ? '⚙️' : index === 1 ? '🩺' : '🎨'}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="handwritten text-amber-700 text-lg mb-2">
                                        {college.tagline}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3" style={{ color: '#3d2f1f' }}>
                                        {college.name}
                                    </h3>
                                    <p className="text-base leading-relaxed mb-6" style={{ color: '#5a4a3a' }}>
                                        {college.description}
                                    </p>

                                    {/* CTA Button with gradient */}
                                    <button className={`w-full px-6 py-3 rounded-xl font-semibold text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-r ${college.gradient}`}>
                                        Explore Campus →
                                    </button>
                                </div>

                                {/* Vintage tape effect */}
                                <div className="absolute top-48 left-8 w-20 h-6 bg-amber-200/40 -rotate-12 blur-sm"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Closing Message */}
                <div className="text-center max-w-2xl mx-auto">
                    <p className="text-lg mb-2" style={{ color: '#5a4a3a' }}>
                        It's not just about where you go...
                    </p>
                    <p className="handwritten text-2xl text-amber-700">
                        It's about who you become along the way ✨
                    </p>
                </div>
            </div>
        </section>
    )
}
