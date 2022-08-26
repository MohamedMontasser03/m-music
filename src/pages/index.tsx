import { Group, Loader, Space, Text } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import type { NextPage } from "next";
import { useEffect, useRef } from "react";
import { TileList } from "../components/tile/TileList";
import MainLayout from "../layouts";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const {
    data: recData,
    isLoading,
    fetchNextPage,
  } = trpc.useInfiniteQuery(["recommendation", {}], {
    getNextPageParam: (prevPage) => {
      return {
        continuation: prevPage?.continuation,
        trackingParam: prevPage?.trackingParam,
      };
    },
    staleTime: Infinity,
  });

  const { entry, ref } = useIntersection();

  useEffect(() => {
    if (
      entry?.isIntersecting &&
      recData?.pages[recData?.pages.length - 1]?.continuation &&
      !isLoading
    ) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry]);

  return (
    <MainLayout title="Home" activePage="home">
      <Text weight="700" size={50} align="center">
        Hello There, <br /> How are you doing?
        <br />
      </Text>
      <div>
        {recData?.pages.map((item) =>
          item?.sections?.map((section, idx) => (
            <div ref={ref} key={section.title + idx}>
              <TileList section={section} />
            </div>
          ))
        )}
      </div>
      {(!!recData?.pages[recData?.pages.length - 1]?.continuation ||
        isLoading ||
        !recData) && (
        <Group align="center" position="center" mt="xl">
          <Loader />
        </Group>
      )}
      <Space h="lg" />
    </MainLayout>
  );
};

export default Home;
