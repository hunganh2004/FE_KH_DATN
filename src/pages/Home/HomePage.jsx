import HeroBanner from './components/HeroBanner'
import FeaturedCategories from './components/FeaturedCategories'
import RecommendedSection from './components/RecommendedSection'
import TrendingSection from './components/TrendingSection'
import RepurchaseReminder from './components/RepurchaseReminder'
import AboutSection from './components/AboutSection'
import useAuthStore from '@/store/authStore'

export default function HomePage() {
  const { user } = useAuthStore()

  return (
    <div>
      <HeroBanner />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        <FeaturedCategories />

        {user && <RepurchaseReminder userId={user.pk_user_id} />}
        <RecommendedSection userId={user?.pk_user_id} />

        <TrendingSection />
      </div>

      <AboutSection />
    </div>
  )
}
