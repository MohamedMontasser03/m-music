import {
  Autocomplete,
  Center,
  Grid,
  Group,
  Input,
  Loader,
  Space,
  Text,
  Title,
} from "@mantine/core";
import type { NextPage } from "next";
import Link from "next/link";
import { SearchBar } from "../components/search-bar/SearchBar";
import { TileList } from "../components/tile/TileList";
import MainLayout from "../layouts";
import { trpc } from "../utils/trpc";
import type { GenreList, HomeReturnType } from "../utils/yt";

const Explore: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["recommendation.explore"]);

  const genres = data?.sections.find(
    (section) => section.title === "Moods and genres"
  ) as { title: string; items: GenreList[] };

  const trackLists = data?.sections.filter(
    (section) => section.title !== "Moods and genres" && section.title // make sure it isn't undefined
  ) as HomeReturnType["sections"];

  return (
    <MainLayout title="Explore" activePage="search">
      <SearchBar />
      <Title pl="md" pt="md">
        {genres?.title}
      </Title>
      <Group p="lg" spacing="sm">
        {genres?.items?.map((genre: GenreList) => (
          <Link key={genre.id} href={`/genre/${genre.id}`}>
            <a>
              <Center
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: 10,
                  backgroundColor: "orange",
                }}
                p="lg"
                key={genre.title}
              >
                <Text weight="400" color="white" size={20} align="center">
                  {genre.title}
                </Text>
              </Center>
            </a>
          </Link>
        ))}
      </Group>
      <Space h="lg" />
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

export default Explore;
