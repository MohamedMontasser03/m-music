import { Card, Image, Stack, Text } from "@mantine/core";
import React from "react";
import { useDispatch } from "react-redux";

type Props = {
  title: string;
  authorName: string;
  thumbnails: {
    url: string;
    width: number;
    height: number;
  }[];
};

export const Tile: React.FC<Props> = ({ title, thumbnails, authorName }) => {
  const dispatch = useDispatch();
  const thumb = thumbnails.sort((a, b) => a.width - b.width)[0];
  const improvedImage = (imageUrl = "") => {
    if (imageUrl.includes("lh3.googleusercontent.com")) {
      return imageUrl.replace("w60", "w180").replace("h60", "h180");
    }

    return imageUrl;
  };
  return (
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
  );
};
