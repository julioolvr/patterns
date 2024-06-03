import { AppShell, Stack } from "@mantine/core";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <AppShell navbar={{ width: 300, breakpoint: "sm" }} padding="md">
        <AppShell.Navbar p="md">
          <Stack>
            <Link to="/">Patterns</Link>
          </Stack>
        </AppShell.Navbar>
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
      <TanStackRouterDevtools />
    </>
  ),
});
