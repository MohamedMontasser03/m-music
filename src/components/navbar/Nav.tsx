import { Navbar, NavLink, Space } from "@mantine/core";
import { useSession } from "next-auth/react";
import React from "react";
import {
  Books,
  Heart,
  History,
  Home,
  NewSection,
  Search,
} from "tabler-icons-react";

export const Nav: React.FC = () => {
  const { status } = useSession();
  return (
    <Navbar width={{ base: 250 }} p="xs">
      <Navbar.Section>
        <NavLink label="Home" icon={<Home />} variant="light" active />
        <NavLink label="Search" icon={<Search />} />
        <NavLink label="My Library" icon={<Books />} />
      </Navbar.Section>
      <Space h="lg" />
      {status === "authenticated" && (
        <Navbar.Section>
          <NavLink label="Create New Library" icon={<NewSection />} />
          <NavLink label="Liked Songs" icon={<Heart />} />
          <NavLink label="Recently Played" icon={<History />} />
        </Navbar.Section>
      )}
    </Navbar>
  );
};
