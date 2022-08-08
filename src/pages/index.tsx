import { Group, Loader, Space, Text } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import type { NextPage } from "next";
import { useEffect, useRef } from "react";
import { TileList } from "../components/tile/TileList";
import MainLayout from "../layouts";
import { trpc } from "../utils/trpc";
import { RecommendationReturnType } from "../utils/yt";

const Home: NextPage = () => {
  const continuationData = useRef<{
    continuation?: string;
    trackingParam?: string;
  }>({});
  const { data, isLoading, refetch } = trpc.useQuery(
    ["recommendation", continuationData.current],
    {
      ssr: true,
      staleTime: Infinity,
      onSuccess(data) {
        sections.current.push(...(data?.key?.sections || []));
      },
    }
  );
  const sections = useRef<RecommendationReturnType["sections"]>([
    ...(data?.key?.sections || []),
  ]);
  const { entry, ref } = useIntersection();

  useEffect(() => {
    if (entry?.isIntersecting && data?.key?.continuation && !isLoading) {
      console.log("Hi");
      continuationData.current.continuation = data.key.continuation;
      continuationData.current.trackingParam = data.key.trackingParam;
      refetch()
        .then(() => {
          console.log("Hio", data);
        })
        .catch(console.error);
    }
  }, [entry]);

  return (
    <MainLayout title="Home">
      <Text weight="700" size={50} align="center">
        Hello There, <br /> How are you doing?
        <br />
      </Text>
      <div>
        {sections.current.map((section, idx) => (
          <div ref={ref} key={section.title + idx}>
            <TileList section={section} />
          </div>
        ))}
      </div>
      {(!!data?.key?.continuation || isLoading) && (
        <Group align="center" position="center" mt="xl">
          <Loader />
        </Group>
      )}
      <Space h="lg" />
    </MainLayout>
  );
};

export default Home;
