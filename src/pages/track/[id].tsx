import { Button, Group, Loader, Space, Stack, Text } from "@mantine/core";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { usePlayerStore } from "../../app/track-player/playerSlice";
import { Image } from "../../components/image/Image";
import MainLayout from "../../layouts";
import { trpc } from "../../utils/trpc";

const Track: NextPage = () => {
  const { query, push } = useRouter();
  const { setQueue, pushTrack } = usePlayerStore((state) => state.actions);
  const { data: result, isLoading } = trpc.useQuery([
    "details.video",
    { id: query.id as string },
  ]);

  if (!result && !isLoading && typeof window !== "undefined") {
    push("/404");
  }

  return (
    <MainLayout title={result?.title ?? "..."} activePage="search">
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
                  {/* - {result?.duration} */}
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
