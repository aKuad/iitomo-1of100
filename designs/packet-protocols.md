# Packet protocols

## Boolean packet

| Length [bytes] | Type  | Description                       |
| -------------: | ----- | --------------------------------- |
|              1 | uint8 | Packet type ID                    |
|              1 | uint8 | Boolean value (0: false, 1: true) |

| Type             | ID   | Direction             | True       | False         |
| ---------------- | ---- | --------------------- | ---------- | ------------- |
| Survey control   | 0x11 | participant <- server | start      | stop          |
| Survey response  | 0x12 | participant -> server | set 'yes'  | unset 'yes'   |
| Moderator status | 0x13 | participant <- server | connecting | disconnecting |

## Uint16 packet

| Length [byte] | Type   | Description             |
| ------------: | ------ | ----------------------- |
|             1 | uint8  | Packet type ID          |
|             2 | uint16 | Unsigned int value (\*) |

> [!NOTE]
>
> (\*) Value is little endian. To get original value: `array[1] | (array[2] << 8)`

| Type              | ID   | Direction           | Value                                |
| ----------------- | ---- | ------------------- | ------------------------------------ |
| Participant count | 0x21 | moderator <- server | Count of all participant             |
| Survey start      | 0x22 | moderator -> server | Duration of survey response          |
| Survey result     | 0x23 | moderator <- server | Count of 'Yes' responded participant |
