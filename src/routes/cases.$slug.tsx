import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cases/$slug")({
  component: CasesSlugLayout,
});

function CasesSlugLayout() {
  return <Outlet />;
}