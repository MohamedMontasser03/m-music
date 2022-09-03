import { ActionIcon, Card, Stack, Text } from "@mantine/core";
import React, { useCallback, useMemo } from "react";
import { trpc } from "../../utils/trpc";
import { TrackType, usePlayerStore } from "../../app/track-player/playerSlice";
import { PlayerPlay } from "tabler-icons-react";
import { Image } from "../image/Image";

type Props = {
  type: "playlist" | "track";
  id: string;
  title: string;
  authorName: string;
  thumbnails: {
    url: string;
    width: number;
    height: number;
  }[];
};

export const Tile: React.FC<Props> = ({
  type,
  id,
  title,
  thumbnails,
  authorName,
}) => {
  const setQueue = usePlayerStore((state) => state.actions.setQueue);
  const thumb = useMemo(
    () => thumbnails.sort((b, a) => a.height - b.height)[0],
    [thumbnails]
  );
  const improvedImage = useCallback((imageUrl = "") => {
    if (imageUrl.includes("lh3.googleusercontent.com")) {
      return imageUrl
        .replace("w60", "w544")
        .replace("h60", "h544")
        .replace("w120", "w544")
        .replace("h120", "h544");
    }

    return imageUrl;
  }, []);
  const typeOfId: typeof type = useMemo(
    () => (id.length === 11 ? "track" : "playlist"),
    [id]
  );

  const { refetch } = trpc.useQuery(
    [
      `details.${typeOfId === "playlist" ? "playlist" : "video"}`,
      {
        id,
      },
    ],
    {
      ssr: false,
      enabled: false,
    }
  );
  return (
    <Card
      withBorder
      sx={{
        maxWidth: 250,
        height: 250 + 175,
      }}
      onClick={() =>
        console.log(thumbnails.sort((a, b) => a.height - b.height)[0], thumb)
      }
    >
      <Card.Section sx={{ position: "relative" }}>
        <Image
          src={improvedImage(thumb?.url)}
          height={250}
          width={250}
          alt={title}
          fallback="https://www.gstatic.com/youtube/media/ytm/images/pbg/attribute-radio-fallback-2@1000.png"
        />
        <ActionIcon
          variant="filled"
          color="red"
          radius="xl"
          p={4}
          onClick={() =>
            refetch().then((res) => {
              if (typeOfId === "track") {
                const vid = res.data as TrackType;
                if (!vid) return;
                setQueue([
                  {
                    id: vid?.id!,
                    title: vid?.title!,
                    authorName: vid?.authorName!,
                    authorId: vid?.authorId!,
                    duration: vid?.duration!,
                    thumbnails: vid?.thumbnails!,
                  },
                ]);
              } else {
                const playlistInfo = res.data as TrackType[];

                setQueue(
                  playlistInfo.map((vid) => ({
                    id: vid?.id!,
                    title: vid?.title!,
                    authorName: vid?.authorName!,
                    authorId: vid?.authorId!,
                    duration: vid?.duration!,
                    thumbnails: vid?.thumbnails!,
                  }))
                );
              }
            })
          }
          sx={{
            position: "absolute",
            bottom: 10,
            right: 10,
          }}
        >
          <PlayerPlay size={35} />
        </ActionIcon>
      </Card.Section>
      <Stack spacing="xs" py="lg">
        <Text lineClamp={2}>{title}</Text>
        <Text color="dimmed" lineClamp={3}>
          {authorName}
        </Text>
      </Stack>
    </Card>
  );
};
