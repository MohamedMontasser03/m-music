import {
  ActionIcon,
  Button,
  Dialog,
  Group,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { ControlledMenu, useMenuState } from "@szhsin/react-menu";
import Router from "next/router";
import { MouseEvent, RefObject, useEffect, useRef, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import {
  ArrowsShuffle,
  Repeat,
  RepeatOff,
  RepeatOnce,
  X,
} from "tabler-icons-react";
import shallow from "zustand/shallow";
import { TrackType, usePlayerStore } from "../../app/track-player/playerSlice";
import { Image as ImageCP } from "../image/Image";

type Props = {
  opened: boolean;
  queue: TrackType[];
  currentTrack: number;
  onClose: () => void;
};

export const PlaylistView: React.FC<Props> = ({
  opened,
  queue,
  currentTrack: idx,
  onClose,
}) => {
  const [{ toggleLoop, reorderQueue, toggleShuffle }, { loop, shuffle }] =
    usePlayerStore((state) => [state.actions, state.playerOptions], shallow);
  const [reqScroll, setReqScroll] = useState(false);
  const [isDrag, setIsDrag] = useState(false);

  useEffect(() => {
    if (opened) {
      setReqScroll(true);
    }
  }, [opened]);

  return (
    <Dialog
      opened={opened}
      size="lg"
      radius="md"
      position={{
        right: 40,
        bottom: 100,
      }}
      onClose={onClose}
    >
      <Group mb="md" position="apart">
        <Group>
          <ActionIcon onClick={() => toggleShuffle()}>
            <ArrowsShuffle opacity={shuffle ? 1 : 0.5} />
          </ActionIcon>
          <ActionIcon onClick={() => toggleLoop()}>
            {loop === "none" ? (
              <RepeatOff />
            ) : loop === "one" ? (
              <RepeatOnce />
            ) : (
              <Repeat />
            )}
          </ActionIcon>
        </Group>
        <ActionIcon onClick={onClose} name="close">
          <X />
        </ActionIcon>
      </Group>
      <ScrollArea
        style={{
          height: 300,
        }}
      >
        <ReactSortable
          list={queue}
          animation={200}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
          setList={() => {}}
          onEnd={({ newIndex, oldIndex, ...rest }) => {
            setIsDrag(false);
            if (
              [oldIndex, newIndex].some((val) => val === undefined) ||
              newIndex === oldIndex
            )
              return;
            console.log(newIndex, oldIndex, rest);
            reorderQueue(oldIndex! / 2, newIndex! / 2);
          }}
          setData={(dataTransfer) => {
            dataTransfer.setDragImage(new Image(), 0, 0);
          }}
          onStart={() => {
            setIsDrag(true);
          }}
          delay={100}
        >
          {queue.map((track, i) => (
            <PlaylistItem
              key={track.id}
              track={track}
              idx={i}
              onRef={(el) => {
                if (queue[idx]?.id !== track.id) return;
                reqScroll &&
                  el?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                setReqScroll(false);
              }}
              isDrag={isDrag}
              queue={queue}
            />
          ))}
        </ReactSortable>
      </ScrollArea>
    </Dialog>
  );
};

const PlaylistItem: React.FC<{
  track: TrackType;
  idx: number;
  onRef: (el: HTMLElement | null) => void;
  queue: TrackType[];
  isDrag: boolean;
}> = ({ track, idx, onRef, queue, isDrag }) => {
  const [{ play, removeTrack }, curIdx] = usePlayerStore(
    (state) => [state.actions, state.currentTrack],
    shallow
  );

  const [menuProps, toggleMenu] = useMenuState();
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });

  const onContextMenu = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setAnchorPoint({ x: e.clientX, y: e.clientY });
    toggleMenu(true);
  };

  return (
    <>
      <Button
        key={track.id}
        onClick={() => play(idx)}
        variant={queue[curIdx]?.id !== track.id ? "subtle" : "light"}
        styles={{
          inner: {
            justifyContent: "flex-start",
          },
          root: {
            ":hover": isDrag
              ? {
                  backgroundColor: "transparent",
                }
              : {},
          },
        }}
        p={4}
        size="lg"
        ref={(el: HTMLButtonElement | null) => onRef(el)}
        onContextMenu={onContextMenu}
      >
        <Group noWrap>
          <ImageCP
            src={track.thumbnails[0]!.url}
            width={40}
            height={40}
            alt={track.title}
            fallback="https://www.gstatic.com/youtube/media/ytm/images/pbg/attribute-radio-fallback-2@1000.png"
          />
          <Text
            style={{
              wordBreak: "break-all",
              whiteSpace: "initial",
              fontSize: "initial",
              lineHeight: "20px",
            }}
            lineClamp={2}
            title={track.title}
          >
            {track.title}
          </Text>
        </Group>
      </Button>
      <ControlledMenu
        {...menuProps}
        anchorPoint={anchorPoint}
        onClose={() => toggleMenu(false)}
        menuStyle={{
          padding: 0,
          zIndex: 1000,
        }}
        onClick={() => toggleMenu(false)}
      >
        <Stack
          sx={(theme) => ({
            backgroundColor: theme.colors?.dark?.[7],
            borderRadius: theme.radius.md,
            border: `1px solid ${theme.colors?.dark?.[6]}`,
          })}
          p="sm"
        >
          {curIdx !== idx && (
            <>
              <Button variant="subtle" onClick={() => play(idx)}>
                Play
              </Button>
              <Button variant="subtle" onClick={() => removeTrack(idx)}>
                Remove
              </Button>
            </>
          )}
          <Button
            variant="subtle"
            onClick={() => Router.push(`/track/${track.id}`)}
          >
            Go to page
          </Button>
          {track.authorId && (
            <Button
              variant="subtle"
              onClick={() => Router.push(`/artist/${track.authorId}`)}
            >
              {" "}
              Go to artist page
            </Button>
          )}
        </Stack>
      </ControlledMenu>
    </>
  );
};
