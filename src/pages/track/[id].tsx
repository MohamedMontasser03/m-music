import { Button, Group, Loader, Space, Stack, Text } from "@mantine/core";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import type { Author } from "ytdl-core";
import { usePlayerStore } from "../../app/track-player/playerSlice";
import { Image } from "../../components/image/Image";
import { TileList } from "../../components/tile/TileList";
import MainLayout from "../../layouts";
import { formatTime } from "../../utils/time";
import { trpc } from "../../utils/trpc";

const Track: NextPage = () => {
  const { query, push } = useRouter();
  const { setQueue, pushTrack } = usePlayerStore((state) => state.actions);
  const { data: result, isLoading } = trpc.useQuery(
    ["details.video.full", { id: query.id as string }],
    {
      staleTime: Infinity,
    }
  );

  if (!result && !isLoading && typeof window !== "undefined") {
    push("/404");
  }

  return (
    <MainLayout title={result?.title ?? "..."}>
      {!isLoading && result ? (
        <Stack>
          <Group p="lg" align="end" position="apart">
            <Group>
              <Image
                src={result.thumbnails[0]?.url!}
                width={200}
                height={200}
                alt={result?.title}
              />
              <Stack>
                <Text size="xl" weight={700}>
                  {result?.title}
                </Text>
                <Text>
                  By{" "}
                  <Link href={`/author/${result.authorId}`}>
                    <a>{result?.authorName}</a>
                  </Link>{" "}
                  - duration: {formatTime(result?.duration)}
                </Text>
                <Text>
                  {result?.videoDetails?.viewCount} views -{" "}
                  {result.videoDetails.likes} likes
                </Text>
              </Stack>
            </Group>
            <Group>
              <Button
                variant="outline"
                color="red"
                onClick={() => setQueue([result])}
              >
                Play
              </Button>
              <Button
                variant="outline"
                color="gray"
                onClick={() => pushTrack(result)}
              >
                Add to queue
              </Button>
            </Group>
          </Group>
          <div>
            <TileList
              section={{
                title: "Related tracks",
                items: result.related_videos.map((vid) => ({
                  type: "track",
                  id: vid.id!,
                  title: vid.title!,
                  thumbnails: vid.thumbnails!,
                  authorName: (vid.author as Author).name,
                  authorId: (vid.author as Author).id,
                })),
              }}
            />
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

export default Track;
