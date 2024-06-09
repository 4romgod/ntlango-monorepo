export default async function Page({ params }: { params: { slug: string } }) {
  return (
    <main>
      <h1>Edit {params.slug} Page</h1>
    </main>
  );
}
