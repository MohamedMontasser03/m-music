import { Carousel } from "@mantine/carousel";
import { Card, Group, Image, Stack, Text, Title } from "@mantine/core";
import React from "react";
import { RecommendationReturnType } from "../../utils/yt";
import { Tile } from "./Tile";

type Props = {
  section: RecommendationReturnType["sections"][number];
};

export const TileList: React.FC<Props> = ({ section }) => {
  return (
    <Group align="center" mt="xl">
      <Title pl="md">{section.title}</Title>
      <Carousel slideSize="25%" loop slideGap="md">
        {section.items.map((item, idx) => (
          <Carousel.Slide key={item.id + idx}>
            <Tile {...item} />
          </Carousel.Slide>
        ))}
      </Carousel>
    </Group>
  );
};
