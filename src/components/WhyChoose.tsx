export default function WhyChoose() {
    const reasons = [
        {
            title: 'Because Dreams Need Guides',
            description: 'Like a lighthouse guiding ships home, our mentors illuminate your path with wisdom gained from walking similar journeys.',
            icon: '🌟',
            emotion: 'Hope'
        },
        {
            title: 'Because You Deserve Support',
            description: 'No one should walk their journey alone. We stand beside you, celebrating victories and lifting you through challenges.',
            icon: '🤝',
            emotion: 'Belonging'
        },
        {
            title: 'Because Growth Is Beautiful',
            description: 'Watch yourself transform from a curious student into the person you were always meant to be. The metamorphosis is magical.',
            icon: '🦋',
            emotion: 'Transformation'
        },
        {
            title: 'Because Your Story Matters',
            description: 'Every student who walks through our doors adds a unique chapter to our story. Your dreams inspire us as much as we inspire you.',
            icon: '📚',
            emotion: 'Significance'
        }
    ]

    return (
        <div className="relative">
            {/* Decorative elements */}
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-amber-200/30 blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-orange-200/30 blur-3xl"></div>

            <div className="relative z-10">
                <div className="text-center mb-12 max-w-3xl mx-auto">
                    <div className="inline-block mb-4">
                        <span className="handwritten text-2xl text-amber-700">Why choose us?</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#3d2f1f' }}>
                        Because Every Dream{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">
                            Deserves Support
                        </span>
                    </h2>
                    <p className="text-lg leading-relaxed" style={{ color: '#5a4a3a' }}>
                        We're not just a platform. We're a community of dreamers, believers, and achievers
                        who understand that your college journey is about more than just grades.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {reasons.map((reason, index) => (
                        <div key={index} className="group">
                            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-amber-100 hover:border-amber-300 relative overflow-hidden h-full">
                                {/* Background pattern */}
                                <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                                    <div className="text-8xl">{reason.icon}</div>
                                </div>

                                <div className="relative z-10">
                                    {/* Emotion tag */}
                                    <div className="inline-block mb-3 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold">
                                        {reason.emotion}
                                    </div>

                                    {/* Icon with animation */}
                                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-500 inline-block">
                                        {reason.icon}
                                    </div>

                                    <h3 className="text-xl font-bold mb-2" style={{ color: '#3d2f1f' }}>
                                        {reason.title}
                                    </h3>

                                    <p className="text-base leading-relaxed" style={{ color: '#5a4a3a' }}>
                                        {reason.description}
                                    </p>
                                </div>

                                {/* Decorative corner */}
                                <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br from-amber-200 to-orange-200 rounded-tl-full opacity-50"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Heartfelt closing message */}
                <div className="max-w-3xl mx-auto text-center">
                    <div className="relative p-6 bg-gradient-to-r from-amber-100 via-orange-50 to-amber-100 rounded-3xl border-4 border-white shadow-2xl">
                        {/* Decorative quotes */}
                        <div className="absolute -top-4 -left-4 text-5xl text-amber-300 opacity-50">"</div>
                        <div className="absolute -bottom-4 -right-4 text-5xl text-amber-300 opacity-50">"</div>

                        <p className="text-xl font-bold mb-3" style={{ color: '#3d2f1f' }}>
                            Your journey to your dream college isn't just about getting in.
                        </p>
                        <p className="text-lg mb-3" style={{ color: '#5a4a3a' }}>
                            It's about discovering who you are, what you're passionate about, and the incredible
                            person you're becoming along the way.
                        </p>
                        <p className="handwritten text-2xl text-amber-700">
                            And we're honored to be part of your story. 💛
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
