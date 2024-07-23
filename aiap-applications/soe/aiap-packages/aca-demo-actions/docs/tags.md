# List of generic ACA Demo bot specific tags

The following is the list of the customer specific tags. For the list of generic tags please see the documentation on aca-core.


| Tag           |Version | Description  | LivePerson Sync | LivePerson Async | Genesys | Socket.io |
| ------------- |:---:| ------------|:--------------:|:---------------:|:------:|:--------:|
| [fail](#fail) | 1 | Conversational retry. Send predefined message to a user, asking to clarify his/her input | N | N | Y | N |
| [handover](#handover) | 1 | Sends a message before a tag and initiates a chat transfer to a human agent | N | N | Y | N |
| [close](#close) | 1 | closes the conversation | N | N | Y | N |

## Tags

### fail

Conversational retry. Send predefined message to a user, asking to clarify his/her input. Fallback is to initiate a handover.
**NOTE: this is Genesys channel specific action**

#### Parameters

| Parameter | Required   | Possible values | Description  |
| :-------- | :---------:| --------------- | ------------ |
| max       |            |                 |              |
| id        |            |                 |              |
| message   |            |                 |              |
| handover  |            |                 |              |
| skill     |            |                 |              |

#### Pre-conditions

Must be passed as the first tag.

#### Post-conditions

### handover

Sends a message before a tag and initiates a chat transfer to a human agent.
**NOTE: this is Genesys channel specific action**

#### Parameters

| Parameter | Required   | Possible values | Description  |
| :-------- | :---------:| --------------- | ------------ |
| skill     |  Yes       |                 |              |

#### Pre-conditions

Must be passed as the last tag.

#### Post-conditions

The chat is transferred to an agent with the given skill.

### close

Closes the conversation.
**NOTE: this is Genesys channel specific action**

#### Parameters

N/A

### Pre-conditions

N/A

#### Post-conditions

The conversation is closed and no other user input will be accepted.
