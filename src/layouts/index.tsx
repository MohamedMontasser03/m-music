import { AppShell, Navbar, Text } from "@mantine/core";
import Head from "next/head";
import { Header } from "../components/header/Header";
import { Nav } from "../components/navbar/Nav";

type Props = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

const MainLayout: React.FC<Props> = ({ title, description, children }) => {
  return (
    <>
      <Head>
        <title>M Music - {title}</title>
        <meta
          name="description"
          content={description ?? "The last music app you'll ever want"}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppShell
        padding={0}
        navbar={<Nav />}
        header={<Header />}
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
            overflowX: "hidden",
          },
        })}
      >
        {children}
      </AppShell>
    </>
  );
};

export default MainLayout;
