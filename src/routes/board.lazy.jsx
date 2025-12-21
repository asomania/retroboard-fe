import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/board")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello board!</div>;
}
