# Sequence diagram

```mermaid
sequenceDiagram
  actor P as Participant
  actor M as Moderator
  participant S as Server

  Note over P,S: Moderator join
  M->>+S: Access<br>/ (index)
  S-->>-M: Page view

  M->>M: Set room ID (or random generate)
  M->>+S: Access<br>/moderator/<ID>
  S-->>-M: Page view
  M->>S: Websocket connect<br>/api/moderator/<ID>
  S->>M: Participant count

  Note over P,S: Participants join (by QR)
  M-->P: View join QR
  P->>+S: Access<br>/participant/<ID>
  S-->>-P: Page view
  P->>S: Websocket connect<br>/api/participant/<ID>
  S->>P: Moderator status
  S->>M: Participant count

  Note over P,S: Participants join (by ID)
  M-->P: Check room ID
  P->>+S: Access<br>/ (index)
  S-->>-P: Page view
  P->>P: Set room ID
  P->>+S: Access<br>/participant/<ID>
  S-->>-P: Page view
  P->>S: Websocket connect<br>/api/participant/<ID>
  S->>P: Moderator status
  S->>M: Participant count

  Note over P,S: Survey start/end
  M->>+S: Start survey
  S->>P: Survey start signal
  P->>P: Enable answer UI
  opt On UI input to set 'Yes'
    P->>S: Set 'Yes' answer
    S->>S: Count increment
  end
  opt On UI input to unset 'Yes'
    P->>S: Unset 'Yes' answer
    S->>S: Count decrement
  end
  S->>P: Survey end signal
  P->>P: Disable answer UI
  S-->>-M: Survey result
```
