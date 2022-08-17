import {
  ActionIcon,
  Button,
  Dialog,
  Group,
  Image,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { useDispatch } from "react-redux";
import { ArrowsShuffle, Cross, RepeatOff, X } from "tabler-icons-react";
import { play, TrackType } from "../../app/track-player/playerSlice";

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
  const dispatch = useDispatch();

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
          <ActionIcon>
            <ArrowsShuffle />
          </ActionIcon>
          <ActionIcon>
            <RepeatOff />
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
        <Stack>
          {queue.map((track, i) => (
            <Button
              key={track.title}
              onClick={() => dispatch(play(i))}
              variant={idx !== i ? "subtle" : "light"}
              styles={{
                inner: {
                  justifyContent: "flex-start",
                },
              }}
              p={4}
              size="lg"
            >
              <Group noWrap>
                <Image
                  src={track.thumbnails[0]?.url}
                  width={40}
                  height={40}
                  alt={track.title}
                />
                <Text
                  style={{
                    wordBreak: "break-all",
                    whiteSpace: "initial",
                    fontSize: "initial",
                    lineHeight: "20px",
                  }}
                  lineClamp={2}
                >
                  {track.title}
                </Text>
              </Group>
            </Button>
          ))}
        </Stack>
      </ScrollArea>
    </Dialog>
  );
};
