import { Popover, Text, NavLink as NavEl } from "@mantine/core";
import Link from "next/link";
import React from "react";

type Props = {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  link: string;
  requiresAuth?: boolean;
};

export const NavLink: React.FC<Props> = ({
  active,
  icon,
  label,
  link,
  requiresAuth = false,
}) => {
  if (active) return <NavEl label={label} icon={icon} active variant="light" />;

  if (requiresAuth) {
    return (
      <Popover width={200} position="bottom" withArrow shadow="md">
        <Popover.Target>
          <NavEl label={label} icon={icon} />
        </Popover.Target>
        <Popover.Dropdown>
          <Text size="sm">You need to be signed in to view this page</Text>
        </Popover.Dropdown>
      </Popover>
    );
  }

  return (
    <Link href={link}>
      <NavEl label={label} icon={icon} />
    </Link>
  );
};
