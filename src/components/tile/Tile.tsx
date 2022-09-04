import { ActionIcon, Card, Group, Stack, Text } from "@mantine/core";
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
  variant?: "Card" | "row";
};

export const Tile: React.FC<Props> = ({
  type,
  id,
  title,
  authorName,
  thumbnails,
  variant = "Card",
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

  const onPlay = useCallback(
    () =>
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
      }),
    [refetch, setQueue, typeOfId]
  );
  const Component = variant === "Card" ? CardTile : CardRow;
  return (
    <Component
      authorName={authorName}
      title={title}
      onPlay={onPlay}
      thumbnailUrl={thumb?.url!}
    />
  );
};

type CardProps = {
  title: string;
  authorName: string;
  thumbnailUrl: string;
  onPlay: () => void;
};

const CardTile: React.FC<CardProps> = ({
  title,
  authorName,
  thumbnailUrl,
  onPlay,
}) => {
  return (
    <Card
      withBorder
      sx={{
        maxWidth: 250,
        height: 250 + 175,
      }}
    >
      <Card.Section sx={{ position: "relative" }}>
        <Image
          src={thumbnailUrl}
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
          onClick={onPlay}
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

const CardRow: React.FC<CardProps> = ({
  title,
  authorName,
  thumbnailUrl,
  onPlay,
}) => {
  return (
    <Group
      sx={(theme) => ({
        background: theme?.colors?.dark?.[7],
      })}
      py="sm"
      px="lg"
      position="apart"
    >
      <Group>
        <Image
          src={thumbnailUrl}
          height={80}
          width={80}
          alt={title}
          fallback="https://www.gstatic.com/youtube/media/ytm/images/pbg/attribute-radio-fallback-2@1000.png"
        />
        <Stack spacing="xs" py="lg">
          <Text lineClamp={1}>{title}</Text>
          <Text color="dimmed" lineClamp={1}>
            {authorName}
          </Text>
        </Stack>
      </Group>
      <ActionIcon
        variant="filled"
        color="red"
        radius="xl"
        p={6}
        size="lg"
        onClick={onPlay}
      >
        <PlayerPlay size={35} />
      </ActionIcon>
    </Group>
  );
};
