import {
  Button,
  Card,
  Image,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import React from "react";
import { useDispatch } from "react-redux";
import { trpc } from "../../utils/trpc";
import { playPlaylist, push } from "../track-player/playerSlice";

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
  const thumb = thumbnails.sort((a, b) => a.width - b.width)[0];
  const improvedImage = (imageUrl = "") => {
    if (imageUrl.includes("lh3.googleusercontent.com")) {
      return imageUrl.replace("w60", "w180").replace("h60", "h180");
    }

    return imageUrl;
  };
  const { refetch } = trpc.useQuery(
    [
      "details.video",
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
    <UnstyledButton
      onClick={() => {
        refetch().then((res) => {
          const vid = res.data;
          type !== "playlist" &&
            dispatch(
              push({
                id: vid?.id!,
                title: vid?.title!,
                authorName: vid?.author!,
                authorId: vid?.authorId!,
                duration: +vid?.duration!,
                thumbnails: vid?.thumbnails!,
                url: vid?.audioFormats[0]?.url!,
              })
            );
        });
      }}
      disabled={type === "playlist"}
    >
      <Card
        withBorder
        sx={{
          maxWidth: 250,
          height: 250 + 150,
        }}
      >
        <Card.Section>
          <Image
            src={improvedImage(thumb?.url)}
            height={250}
            width={250}
            alt={title}
          />
        </Card.Section>
        <Stack spacing="xs" py="lg">
          <Text lineClamp={2}>{title}</Text>
          <Text color="dimmed" lineClamp={3}>
            {authorName}
          </Text>
        </Stack>
      </Card>
    </UnstyledButton>
  );
};
