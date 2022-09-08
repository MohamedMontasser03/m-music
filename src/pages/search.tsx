import {
  ActionIcon,
  Autocomplete,
  Group,
  Loader,
  Space,
  Stack,
} from "@mantine/core";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { SearchOff } from "tabler-icons-react";
import { SearchBar } from "../components/search-bar/SearchBar";
import { TileList } from "../components/tile/TileList";
import MainLayout from "../layouts";
import { trpc } from "../utils/trpc";

const Search: NextPage = () => {
  const {
    query: { q },
    push,
  } = useRouter();
  const { data: result, isLoading } = trpc.useQuery(
    ["recommendation.search", { query: q as string }],
    {
      staleTime: Infinity,
    }
  );

  if (!q) {
    push("/");
  }

  return (
    <MainLayout title={`Search ${q}`} activePage="search">
      <SearchBar defaultQuery={q as string} />
      {!isLoading && result ? (
        <Stack>
          <div>
            {result.sections
              .filter((section) => section.items[0]?.id)
              .map((section) => (
                <div key={section.title}>
                  <TileList section={section} />
                </div>
              ))}
          </div>
        </Stack>
      ) : (
        <Group align="center" position="center" mt="xl">
          <Loader />
        </Group>
      )}
      <Space h="lg" />
    </MainLayout>
  );
};

export default Search;
