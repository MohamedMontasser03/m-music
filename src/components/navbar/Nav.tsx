import { Navbar, NavLink, NavLinkProps, Space, Stack } from "@mantine/core";
import { useSession } from "next-auth/react";
import React from "react";
import { Books, Heart, History, Home, Search } from "tabler-icons-react";

export type Page = "home" | "search" | "my-library" | "recent" | "liked";

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
          <NavLink
            label="My Library"
            icon={<Books />}
            {...(currentTab === "my-library" ? activeProps : {})}
          />
        </Stack>
      </Navbar.Section>
      <Space h="xl" />

      <Navbar.Section>
        <NavLink
          label="Liked Songs"
          icon={<Heart />}
          {...(currentTab === "liked" ? activeProps : {})}
        />
        <NavLink
          label="Recently Played"
          icon={<History />}
          {...(currentTab === "recent" ? activeProps : {})}
        />
      </Navbar.Section>
    </Navbar>
  );
};
