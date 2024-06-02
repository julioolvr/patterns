import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/p/$patternId")({
  component: Pattern,
});

function Pattern() {
  const { patternId } = Route.useParams();
  return <div>Hello /p/{patternId}!</div>;
}
