import { createFileRoute } from "@tanstack/react-router";
import { getPattern } from "../../queries/patterns";

export const Route = createFileRoute("/p/$patternId")({
  component: Pattern,
  loader: ({ params }) => getPattern(params.patternId),
});

function Pattern() {
  const { patternId } = Route.useParams();
  const data = Route.useLoaderData();
  return (
    <div>
      Hello /p/{patternId}!<pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
