// TODO: This is an async Server Component — get the project id from params,
// fetch the project, and render a client component for the interactive
// task management and AI features.

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Project Detail</h1>
      <p className="text-muted-foreground">Project ID: {id}</p>
      <p className="text-muted-foreground">
        Replace this with your project detail view, including AI features.
      </p>
    </main>
  );
}
