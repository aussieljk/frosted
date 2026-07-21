import { createFileRoute, Link } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';

import { DemoView } from '@/components/demo';
import { demos } from '@/demos';
import { baseOptions } from '@/lib/layout.shared';

export const Route = createFileRoute('/examples')({
  head: () => ({
    meta: [{ title: 'All examples | Frosted UI' }],
  }),
  component: ExamplesPage,
});

function ExamplesPage() {
  return (
    <HomeLayout {...baseOptions()}>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
        <h1 className="mb-2 text-3xl font-semibold">All examples</h1>
        <p className="text-fd-muted-foreground mb-10">
          Every live demo from the docs, rendered on a single page. Each demo links back to its docs page.
        </p>

        <div className="flex flex-col gap-12">
          {demos.map((demo) => (
            <section key={demo.id} id={demo.id}>
              <div className="mb-2 flex items-baseline justify-between gap-4">
                <h2 className="text-xl font-semibold">
                  <a href={`#${demo.id}`}>{demo.title}</a>
                </h2>
                <Link
                  to="/docs/$"
                  params={{ _splat: demo.docPath.replace(/^\/docs\//, '') }}
                  className="text-fd-muted-foreground text-sm hover:underline"
                >
                  View docs →
                </Link>
              </div>
              <DemoView entry={demo} />
            </section>
          ))}
        </div>
      </main>
    </HomeLayout>
  );
}
