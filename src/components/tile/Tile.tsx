import {
  ActionIcon,
  Button,
  Card,
  Image,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import React, { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { trpc } from "../../utils/trpc";
import { pushTrack, setQueue } from "../../app/track-player/playerSlice";
import { PlayerPlay } from "tabler-icons-react";
import { TrackInfo } from "../../server/router/details";

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
  const dispatch = useDispatch();
  const thumb = useMemo(
    () => thumbnails.sort((a, b) => a.width - b.width)[0],
    [thumbnails]
  );
  const improvedImage = useCallback((imageUrl = "") => {
    if (imageUrl.includes("lh3.googleusercontent.com")) {
      return imageUrl.replace("w60", "w544").replace("h60", "h544");
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
    >
      <Card.Section sx={{ position: "relative" }}>
        <Image
          src={improvedImage(thumb?.url)}
          height={250}
          width={250}
          alt={title}
        />
        <ActionIcon
          variant="filled"
          color="red"
          radius="xl"
          p={4}
          onClick={() =>
            refetch().then((res) => {
              if (typeOfId === "track") {
                const vid = res.data as TrackInfo;
                if (!vid) return;
                dispatch(
                  setQueue([
                    {
                      id: vid?.id!,
                      title: vid?.title!,
                      authorName: vid?.author!,
                      authorId: vid?.authorId!,
                      duration: +vid?.duration!,
                      thumbnails: vid?.thumbnails!,
                      url: vid?.audioFormats[0]?.url!,
                    },
                  ])
                );
              } else {
                const playlistInfo = res.data as TrackInfo[];

                dispatch(
                  setQueue(
                    playlistInfo.map((vid) => ({
                      id: vid?.id!,
                      title: vid?.title!,
                      authorName: vid?.author!,
                      authorId: vid?.authorId!,
                      duration: +vid?.duration!,
                      thumbnails: vid?.thumbnails!,
                      url: vid?.audioFormats[0]?.url!,
                    }))
                  )
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
