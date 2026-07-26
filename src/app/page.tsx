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
    <main>
      <NavHotbar />
      <HeroSection />
      <AboutSection />
      <DiscordWidget />
      <GitHubSection />
      <LibrarySection />
      <FriendsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
