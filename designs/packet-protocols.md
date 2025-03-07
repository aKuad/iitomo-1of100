# Packet protocols

## Survey control packet

moderator -> server

server -> participant

| Length [bytes] | Type  | Description                        |
| -------------: | ----- | ---------------------------------- |
|              1 | uint8 | Packet type ID (0x10)              |
|              1 | uint8 | Survey control (0: stop, 1: start) |

## Survey response packet

participant -> server

| Length [bytes] | Type  | Description                                |
| -------------: | ----- | ------------------------------------------ |
|              1 | uint8 | Packet type ID (0x20)                      |
|              1 | uint8 | Survey response (0: unset yes, 1: set yes) |

## Moderator status packet

server -> participant

| Length [byte] | Type  | Description                                      |
| ------------: | ----- | ------------------------------------------------ |
|             1 | uint8 | Packet type ID (0x30)                            |
|             1 | uint8 | Moderator status (0: Disconnected, 1: connected) |

## Participant count packet

serve -> moderator

| Length [byte] | Type   | Description            |
| ------------: | ------ | ---------------------- |
|             1 | uint8  | Packet type ID (0x40)  |
|             2 | uint16 | Participant count (\*) |

> [!NOTE]
>
> (\*) Value is little endian. To get original value: `array[1] | (array[2] << 8)`
