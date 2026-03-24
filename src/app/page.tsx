import AdsSection from '@/components/AdsSection'
import FeaturedSlider from '@/components/FeaturedSlider'
import Hero from '@/components/Hero'
import NoticeBoard from '@/components/NoticeBoard'
import WhyChoose from '@/components/WhyChoose'

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedSlider />
      <WhyChoose />
      <NoticeBoard />
      <AdsSection />

    </>
  )
}
