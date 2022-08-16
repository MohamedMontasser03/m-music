import {
  ActionIcon,
  Dialog,
  Group,
  Image,
  ScrollArea,
  Slider,
  Stack,
  Text,
} from "@mantine/core";
import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import {
  PlayerPause,
  PlayerPlay,
  PlayerTrackNext,
  PlayerTrackPrev,
  Playlist,
  Volume,
  Volume2,
  Volume3,
} from "tabler-icons-react";
import { StoreType } from "../../app/store";
import {
  pause,
  play,
  playNext,
  playPrev,
  reorder,
  setProgress,
  setVolume,
} from "../../app/track-player/playerSlice";

export const TrackPlayer: React.FC = () => {
  const {
    queue,
    currentTrack: idx,
    isPlaying,
    progress,
    volume,
  } = useSelector((state: StoreType) => state.player);
  const dispatch = useDispatch();
  const [isPlaylistOpen, setPlaylistOpen] = React.useState(false);

  const formatTime = (time: number, max?: number) => {
    const includeHours = (max ?? 0) / 3600 > 1 || (time ?? 0) / 3600 > 1;
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor(time / 60) % 60;
    const seconds = Math.floor(time % 60);
    return `${
      includeHours ? `${hours}:${minutes < 10 ? "0" : ""}` : ""
    }${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  return (
    <>
      <Dialog opened={queue.length > 0} size="xl" radius="md">
        <Group noWrap>
          <Image
            src={
              [...(queue[idx]?.thumbnails || [])].sort(
                (a, b) => b.width - a.width
              )[0]?.url
            }
            width={150}
            height={150}
            alt={queue[idx]?.title}
          />
          <Stack
            sx={{
              flexGrow: 1,
            }}
            justify="center"
            align="flex-start"
          >
            <Text lineClamp={1}>{queue[idx]?.title}</Text>
            <Group
              sx={{
                width: "100%",
              }}
            >
              <Text>{formatTime(progress, queue[idx]?.duration)}</Text>
              <Slider
                label={(v) => formatTime(v)}
                value={Math.floor(progress)}
                max={queue[idx]?.duration}
                onChange={(value) => {
                  dispatch(setProgress({ value }));
                  console.log("not end");
                }}
                onChangeEnd={(value) => {
                  dispatch(setProgress({ value, end: true }));
                  console.log("end");
                }}
                sx={{
                  flexGrow: 1,
                }}
              />
              <Text>{formatTime(queue[idx]?.duration || 0)}</Text>
            </Group>
            <Group
              position="apart"
              sx={{
                width: "100%",
              }}
            >
              <Group
                sx={{
                  flexGrow: 1,
                }}
                spacing={0}
              >
                <ActionIcon>
                  {volume > 0.5 ? (
                    <Volume />
                  ) : volume > 0 ? (
                    <Volume2 />
                  ) : (
                    <Volume3 />
                  )}
                </ActionIcon>
                <Slider
                  sx={{
                    flexGrow: 1,
                  }}
                  label={(v) => Math.floor(v * 100) + "%"}
                  value={volume}
                  max={1}
                  step={0.01}
                  onChange={(v) => dispatch(setVolume(v))}
                />
              </Group>
              <Group>
                <ActionIcon
                  variant="outline"
                  radius="xl"
                  onClick={() => dispatch(playPrev())}
                >
                  <PlayerTrackPrev size={15} />
                </ActionIcon>
                <ActionIcon
                  variant="outline"
                  radius="xl"
                  onClick={() => dispatch(isPlaying ? pause() : play())}
                >
                  {isPlaying ? (
                    <PlayerPause size={15} />
                  ) : (
                    <PlayerPlay size={15} />
                  )}
                </ActionIcon>
                <ActionIcon
                  disabled={idx === queue.length - 1}
                  variant="outline"
                  radius="xl"
                  onClick={() => dispatch(playNext())}
                >
                  <PlayerTrackNext size={15} />
                </ActionIcon>
              </Group>
              <Group>
                <ActionIcon onClick={() => setPlaylistOpen((v) => !v)}>
                  <Playlist />
                </ActionIcon>
              </Group>
            </Group>
          </Stack>
        </Group>
      </Dialog>
      <Dialog
        opened={isPlaylistOpen}
        size="lg"
        radius="md"
        position={{
          right: 40,
          bottom: 100,
        }}
      >
        <DragDropContext
          onDragEnd={(result) => {
            if (!result.destination) return;
            dispatch(
              reorder({
                from: result.source.index,
                to: result.destination.index,
              })
            );
          }}
        >
          <Droppable droppableId="queue">
            {(provided) => (
              <ScrollArea
                style={{
                  height: "10rem",
                  overflowY: "auto",
                }}
              >
                <Stack {...provided.droppableProps} ref={provided.innerRef}>
                  {queue.map((track, i) => (
                    <Draggable
                      key={track.title}
                      draggableId={track.title}
                      index={i}
                    >
                      {(provided) => (
                        <div
                          onClick={() => dispatch(play(i))}
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                          style={{
                            ...provided.draggableProps.style,
                          }}
                        >
                          <Group
                            noWrap
                            p={4}
                            sx={{
                              backgroundColor: i === idx ? "#0066FF55" : "",
                              borderRadius: 4,
                            }}
                          >
                            <Image
                              src={track.thumbnails[0]?.url}
                              width={40}
                              height={40}
                              alt={track.title}
                            />
                            <Text lineClamp={2}>{track.title}</Text>
                          </Group>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Stack>
              </ScrollArea>
            )}
          </Droppable>
        </DragDropContext>
      </Dialog>
    </>
  );
};
