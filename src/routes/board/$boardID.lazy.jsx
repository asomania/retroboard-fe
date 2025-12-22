import { createLazyFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

export const Route = createLazyFileRoute("/board/$boardID")({
  component: BoardDetailRoute,
});

function BoardDetailRoute() {
  const { boardID } = Route.useParams();
  const { data } = useQuery({
    queryKey: ["boards"],
    queryFn: () => fetch("/boards/a0").then((r) => r.json()),
  });

  return (
    <div className="p-4 text-slate-900">
      <p className="text-sm font-semibold text-slate-600">Board ID</p>
      <p className="text-2xl font-bold">{boardID}</p>
      <p className="text-2xl font-bold">{data}</p>
    </div>
  );
}
