import { Center, Image as MImage, ImageProps, Loader } from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  fallback?: string;
} & ImageProps &
  React.RefAttributes<HTMLDivElement>;

export const Image: React.FC<Props> = ({
  src,
  alt,
  width,
  height,
  fallback,
  ...props
}) => {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  const onLoad = (): void => {
    setLoaded(true);
  };

  const onError = (): void => {
    if (fallback && imageRef.current) {
      imageRef.current.src = fallback;
    }
  };

  return (
    <>
      <MImage
        {...props}
        src={src}
        alt={alt}
        width={width}
        height={height}
        onLoad={onLoad}
        onError={onError}
        imageRef={(el) => {
          if (!el) return;
          el?.complete && !el?.naturalHeight && fallback && (el.src = fallback);
          el?.naturalHeight && setLoaded(true);
          imageRef.current = el;
        }}
        sx={!loaded ? { position: "absolute", opacity: 0 } : {}}
      />
      {!loaded && (
        <Center
          sx={(theme) => ({
            width: width,
            height: height,
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark?.[7]
                : theme.colors.gray?.[0],
          })}
        >
          <Loader />
        </Center>
      )}
    </>
  );
};
