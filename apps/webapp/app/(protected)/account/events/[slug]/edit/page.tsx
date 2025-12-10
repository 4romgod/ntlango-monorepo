interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Page(props: Props) {
  const params = await props.params;

  return (
    <main>
      <h1>Edit {params.slug} Page</h1>
    </main>
  );
}
