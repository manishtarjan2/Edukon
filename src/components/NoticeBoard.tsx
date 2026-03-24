export default function NoticeBoard() {
    const notices = [
        'Admissions open. Apply before 31st October.',
        'Tech Fest on 15th November.',
        'Exams start 20th November.'
    ]

    return (
        <section className="py-12 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Notice Board Card */}
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 md:p-8 border-l-8 border-amber-500 shadow-lg overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-5">
                            <span className="text-3xl">📌</span>
                            <h2 className="text-2xl md:text-3xl font-bold text-amber-600">
                                Notice Board
                            </h2>
                        </div>

                        {/* Notice List */}
                        <ul className="space-y-2.5 overflow-hidden">
                            {notices.map((notice, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm md:text-base overflow-hidden">
                                    <span className="text-amber-600 mt-0.5 font-bold flex-shrink-0">•</span>
                                    <p className="text-gray-800 overflow-hidden text-ellipsis" style={{ color: '#3d2f1f' }}>
                                        {notice}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}
