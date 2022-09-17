import { Carousel } from "@mantine/carousel";
import { Group, Title } from "@mantine/core";
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
      <Carousel
        slideSize="25%"
        loop
        slideGap="md"
        onMouseDown={() => {
          // re run the default behavior of the mouseDown event
          window.getSelection()?.removeAllRanges();
          if (document.activeElement instanceof HTMLElement)
            document.activeElement.blur();
        }}
      >
        {section.items.map((item, idx) => (
          <Carousel.Slide key={item.id + idx}>
            <Tile {...item} />
          </Carousel.Slide>
        ))}
      </Carousel>
    </Group>
  );
};
