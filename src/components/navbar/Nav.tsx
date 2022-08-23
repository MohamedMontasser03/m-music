import {
  Navbar,
  NavLink,
  NavLinkProps,
  Popover,
  Space,
  Stack,
  Text,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import React from "react";
import { Books, Heart, History, Home, Search } from "tabler-icons-react";

export type Page =
  | "home"
  | "search"
  | "my-library"
  | "recent"
  | "liked"
  | "none";

type Props = {
  currentTab?: Page;
};

const activeProps = {
  variant: "light" as NavLinkProps["variant"],
  active: true,
} as const;

export const Nav: React.FC<Props> = ({ currentTab }) => {
  const { status } = useSession();
  return (
    <Navbar width={{ base: 250 }} px="xs" py="lg">
      <Navbar.Section>
        <Stack spacing="xs">
          <NavLink
            label="Home"
            icon={<Home />}
            {...(currentTab === "home" ? activeProps : {})}
          />
          <NavLink
            label="Search"
            icon={<Search />}
            {...(currentTab === "search" ? activeProps : {})}
          />
          <Popover width={200} position="bottom" withArrow shadow="md">
            <Popover.Target>
              <NavLink
                label="My Library"
                icon={<Books />}
                {...(currentTab === "my-library" ? activeProps : {})}
              />
            </Popover.Target>
            <Popover.Dropdown>
              <Text size="sm">You need to be signed in to view this page</Text>
            </Popover.Dropdown>
          </Popover>
        </Stack>
      </Navbar.Section>
      <Space h="xl" />

      <Navbar.Section>
        <Popover width={200} position="bottom" withArrow shadow="md">
          <Popover.Target>
            <NavLink
              label="Liked Songs"
              icon={<Heart />}
              {...(currentTab === "liked" ? activeProps : {})}
            />
          </Popover.Target>
          <Popover.Dropdown>
            <Text size="sm">You need to be signed in to view this page</Text>
          </Popover.Dropdown>
        </Popover>
        <Popover width={200} position="bottom" withArrow shadow="md">
          <Popover.Target>
            <NavLink
              label="Recently Played"
              icon={<History />}
              {...(currentTab === "recent" ? activeProps : {})}
            />
          </Popover.Target>
          <Popover.Dropdown>
            <Text size="sm">You need to be signed in to view this page</Text>
          </Popover.Dropdown>
        </Popover>
      </Navbar.Section>
    </Navbar>
  );
};
