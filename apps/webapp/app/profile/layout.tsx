import ProfileSideNav from '@/components/navigation/profile/navigations';
import ProfileLinks from '@/app/profile/profile-links';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <ProfileSideNav links={ProfileLinks} />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
