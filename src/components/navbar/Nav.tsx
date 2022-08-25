import {
  Navbar,
  NavLinkProps,
  Popover,
  Space,
  Stack,
  Text,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import React from "react";
import { Books, Heart, History, Home, Search } from "tabler-icons-react";
import { NavLink } from "./NavLink";

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
            active={currentTab === "home"}
            link="/"
          />

          <NavLink
            label="Search"
            icon={<Search />}
            active={currentTab === "search"}
            link="/explore"
          />
          <NavLink
            label="My Library"
            icon={<Books />}
            active={currentTab === "my-library"}
            link="/library"
            requiresAuth
          />
        </Stack>
      </Navbar.Section>
      <Space h="xl" />

      <Navbar.Section>
        <NavLink
          label="Liked Songs"
          icon={<Heart />}
          active={currentTab === "liked"}
          link="/liked"
          requiresAuth
        />
        <NavLink
          label="Recently Played"
          icon={<History />}
          active={currentTab === "recent"}
          link="/recent"
          requiresAuth
        />
      </Navbar.Section>
    </Navbar>
  );
};
