import { Button, Group, Loader, Space, Stack, Text } from "@mantine/core";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { usePlayerStore } from "../../app/track-player/playerSlice";
import { Image } from "../../components/image/Image";
import { Tile } from "../../components/tile/Tile";
import MainLayout from "../../layouts";
import { trpc } from "../../utils/trpc";

const Genre: NextPage = () => {
  const { query, push } = useRouter();
  const { setQueue } = usePlayerStore((state) => state.actions);
  const { data: result, isLoading } = trpc.useQuery([
    "details.playlist.full",
    { id: query.id as string },
  ]);

  if (!result && !isLoading && typeof window !== "undefined") {
    push("/404");
  }

  return (
    <MainLayout title={result?.title ?? "..."} activePage="search">
      {!isLoading && result ? (
        <Stack>
          <Group p="lg" align="end">
            <Image
              src={result.bestThumbnail.url!}
              width={200}
              height={200}
              alt={result?.title}
            />
            <Stack>
              <Text size="xl" weight={700}>
                {result?.title}
              </Text>
              {result?.author ? (
                <Text>
                  By{" "}
                  <Link href={`/author/${result.author.channelID}`}>
                    <a>{result?.author.name}</a>
                  </Link>{" "}
                  - {result?.items.length} track
                </Text>
              ) : (
                <Text>Autogenerated - {result?.items.length} track</Text>
              )}
            </Stack>
            <Button
              variant="outline"
              color="red"
              onClick={() => setQueue(result.items)}
            >
              Play
            </Button>
          </Group>
          <Stack p="lg">
            {result.items.map((item) => (
              <Tile type="track" key={item.id} {...item} variant="row" />
            ))}
          </Stack>
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

export default Genre;
