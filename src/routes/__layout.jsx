import { createFileRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
export const Route = createFileRoute("/__layout")({
  component: Layout,
});

function Layout() {
  return (
    <>
      <div>Layout hader</div>
      <Outlet />
    </>
  );
}
