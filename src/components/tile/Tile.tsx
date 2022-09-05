import {
  ActionIcon,
  Button,
  Card,
  Group,
  Menu,
  Stack,
  Text,
} from "@mantine/core";
import React, {
  forwardRef,
  MouseEvent,
  PropsWithoutRef,
  PropsWithRef,
  useCallback,
  useMemo,
  useState,
} from "react";
import { trpc } from "../../utils/trpc";
import { TrackType, usePlayerStore } from "../../app/track-player/playerSlice";
import { PlayerPlay } from "tabler-icons-react";
import { Image } from "../image/Image";
import Router from "next/router";
import { useMenuState, ControlledMenu, MenuItem } from "@szhsin/react-menu";

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
  authorId?: string;
};

export const Tile: React.FC<Props> = ({
  type,
  id,
  title,
  authorName,
  authorId,
  thumbnails,
  variant = "Card",
}) => {
  const { setQueue, pushTrack, queNext } = usePlayerStore(
    (state) => state.actions
  );
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

  const [menuProps, toggleMenu] = useMenuState();
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });

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

  const onContextMenu = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setAnchorPoint({ x: e.clientX, y: e.clientY });
    toggleMenu(true);
  };

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
    <>
      <Component
        authorName={authorName}
        title={title}
        onPlay={onPlay}
        thumbnailUrl={improvedImage(thumb?.url!)}
        onContextMenu={onContextMenu}
      />
      <ControlledMenu
        {...menuProps}
        anchorPoint={anchorPoint}
        onClose={() => toggleMenu(false)}
        menuStyle={{
          padding: 0,
          zIndex: 1000,
        }}
      >
        <Stack
          sx={(theme) => ({
            backgroundColor: theme.colors?.dark?.[7],
            borderRadius: theme.radius.md,
          })}
          p="sm"
        >
          <Button variant="subtle" onClick={onPlay}>
            Play
          </Button>
          {typeOfId === "track" && (
            <>
              <Button
                variant="subtle"
                onClick={() =>
                  refetch().then((track) => pushTrack(track.data as TrackType))
                }
              >
                Add to queue
              </Button>
              <Button
                variant="subtle"
                onClick={() =>
                  refetch().then((track) => queNext(track.data as TrackType))
                }
              >
                Que next
              </Button>
            </>
          )}
          <Button
            variant="subtle"
            onClick={() => Router.push(`/${typeOfId}/${id}`)}
          >
            Go to page
          </Button>
          {authorId && (
            <Button
              variant="subtle"
              onClick={() => Router.push(`/artist/${authorId}`)}
            >
              Go to artist
            </Button>
          )}
        </Stack>
      </ControlledMenu>
    </>
  );
};

type CardProps = {
  title: string;
  authorName: string;
  thumbnailUrl: string;
  onPlay: () => void;
  onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
};

const CardTile: React.FC<CardProps> = ({
  title,
  authorName,
  thumbnailUrl,
  onPlay,
  onContextMenu,
}) => {
  return (
    <Card
      withBorder
      sx={{
        maxWidth: 250,
        height: 250 + 175,
      }}
      onContextMenu={onContextMenu}
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
  onContextMenu,
}) => {
  return (
    <Group
      sx={(theme) => ({
        background: theme?.colors?.dark?.[7],
      })}
      py="sm"
      px="lg"
      position="apart"
      onContextMenu={onContextMenu}
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
