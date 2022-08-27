import { Group, Loader, Space, Text } from "@mantine/core";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { TileList } from "../../components/tile/TileList";
import MainLayout from "../../layouts";
import { trpc } from "../../utils/trpc";

const Genre: NextPage = () => {
  const { query, push } = useRouter();
  const { data: result, isLoading } = trpc.useQuery([
    "recommendation.genre",
    { id: query.id as string },
  ]);

  if (!result && !isLoading && typeof window !== "undefined") {
    push("/404");
  }
  return (
    <MainLayout title="Explore" activePage="search">
      <Text weight="700" size={50} align="center" pt="md">
        {result?.title}
      </Text>
      <div>
        {result?.data?.sections.map((item) => (
          <TileList key={item?.title} section={item} />
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

export default Genre;
