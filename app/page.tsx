// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Link from "next/link"

// TODO: This is a Server Component — fetch projects directly from the database
// or via your API, then render them here. No "use client" needed for the list.

// TODO: Add a client component for "Create Project" dialog (interactive)
// TODO: Use <Link href="/projects/[id]"> for navigating to project detail

export default function Page() {
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Task Tracker</h1>
            <p className="mt-1 text-muted-foreground">
              Manage projects and tasks with AI-powered insights
            </p>
          </div>
          {/* TODO: Add a <CreateProjectDialog /> client component here */}
        </div>

        {/* TODO: Fetch and display projects as cards */}
        {/* Each card should link to /projects/[id] using next/link */}
        <p className="text-muted-foreground">
          Replace this with your project list. Use{" "}
          <code className="text-sm">{"<Link>"}</code> from{" "}
          <code className="text-sm">next/link</code> to navigate to{" "}
          <code className="text-sm">/projects/[id]</code>.
        </p>
      </div>
    </main>
  )
}
