import { Group, Loader, Space, Text } from "@mantine/core";
import type { NextPage } from "next";
import { TileList } from "../components/tile/TileList";
import MainLayout from "../layouts";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["recommendation.explore"]);
  const genres = data?.sections.find(
    (section) => section.title === "Moods and genres"
  );
  const trackLists = data?.sections.filter(
    (section) => section.title !== "Moods and genres"
  );

  return (
    <MainLayout title="Explore" activePage="search">
      <div>
        {trackLists?.map((item) => (
          <TileList key={item.title} section={item} />
        ))}
      </div>
      {isLoading && (
        <Group align="center" position="center" mt="xl">
          <Loader />
        </Group>
      )}
      <Space h="lg" />
    </MainLayout>
  );
};

export default Home;
