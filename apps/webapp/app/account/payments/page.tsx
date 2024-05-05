import { lusitana } from '@/components/theme/fonts';

export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Payments</h1>
    </main>
  );
}
