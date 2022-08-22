import React from "react";
import { Button, Group, Header as AppHeader, Title } from "@mantine/core";
import { Music } from "tabler-icons-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export const Header: React.FC = () => {
  const { status } = useSession();
  return (
    <AppHeader height={60}>
      <Group
        px={25}
        position="apart"
        align="center"
        style={{
          height: "100%",
        }}
      >
        <Link href="/">
          <a>
            <Group align="center">
              <Music size={40} />
              <Title order={1}>M Music</Title>
            </Group>
          </a>
        </Link>
        {status !== "authenticated" && (
          <Group>
            <Button>Login</Button>
          </Group>
        )}
      </Group>
    </AppHeader>
  );
};
