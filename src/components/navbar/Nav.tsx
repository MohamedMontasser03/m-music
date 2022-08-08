import { Navbar, NavLink, Space, Stack } from "@mantine/core";
import { useSession } from "next-auth/react";
import React from "react";
import {
  Books,
  Heart,
  History,
  Home,
  NewSection,
  Playlist,
  Search,
} from "tabler-icons-react";

export const Nav: React.FC = () => {
  const { status } = useSession();
  return (
    <Navbar width={{ base: 250 }} px="xs" py="lg">
      <Navbar.Section>
        <Stack spacing="xs">
          <NavLink label="Home" icon={<Home />} variant="light" active />
          <NavLink label="Search" icon={<Search />} />
          <NavLink label="My Library" icon={<Books />} />
        </Stack>
      </Navbar.Section>
      <Space h="xl" />

      <Navbar.Section>
        <NavLink label="Liked Songs" icon={<Heart />} />
        <NavLink label="Recently Played" icon={<History />} />
      </Navbar.Section>
    </Navbar>
  );
};
