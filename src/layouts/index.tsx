import { AppShell, Navbar, Text } from "@mantine/core";
import Head from "next/head";
import { Header } from "../components/header/Header";
import { Nav, Page } from "../components/navbar/Nav";
import { TrackPlayer } from "../components/track-player/TrackPlayer";

type Props = {
  title: string;
  description?: string;
  children?: React.ReactNode;
  activePage?: Page;
};

const MainLayout: React.FC<Props> = ({
  title,
  description,
  children,
  activePage,
}) => {
  return (
    <>
      <Head>
        <title>{`M Music - ${title}`}</title>
        <meta
          name="description"
          content={description ?? "The last music app you'll ever want"}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppShell
        padding={0}
        navbar={<Nav currentTab={activePage} />}
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
        <TrackPlayer />
      </AppShell>
    </>
  );
};

export default MainLayout;
