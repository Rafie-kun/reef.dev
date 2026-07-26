import NavHotbar from '@/components/NavHotbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import DiscordWidget from '@/components/DiscordWidget';
import GitHubSection from '@/components/GitHubSection';
import LibrarySection from '@/components/LibrarySection';
import FriendsSection from '@/components/FriendsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="relative">
      <NavHotbar />
      <HeroSection />
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-24">
        <AboutSection />
        <DiscordWidget />
        <GitHubSection />
        <LibrarySection />
        <FriendsSection />
        <ContactSection />
      </div>
      <Footer />
    </main>
  );
}
