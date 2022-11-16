export default {
  name: 'ChangeStateAfterTime',
  nodes: [
    {
      type: 'OnTick',
      internalValues: [],
    },
    {
      type: 'GetControlledEntity',
      internalValues: [],
    },
    {
      type: 'GetEntityVariable',
      internalValues: [],
    },
    {
      type: 'ExportVariable',
      internalValues: ['timer', 'timer'],
    },
    {
      type: 'Subtract',
      internalValues: [],
    },
    {
      type: 'GetTime',
      internalValues: [],
    },
    {
      type: 'GreaterEquals',
      internalValues: [],
    },
    {
      type: 'ExportInt',
      internalValues: ['duration', 500],
    },
    {
      type: 'SetEntityState',
      internalValues: [],
    },
    {
      type: 'GetControlledEntity',
      internalValues: [],
    },
    {
      type: 'ExportState',
      internalValues: ['state', 'Default'],
    },
  ],
  edges: [
    {
      in: [],
      out: [
        {
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 0,
          inputNode: 1,
        },
      ],
    },
    {
      in: [
        {
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 0,
          inputNode: 1,
        },
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 1,
          inputNode: 2,
        },
      ],
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 1,
          inputNode: 2,
        },
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 3,
          inputNode: 2,
        },
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 2,
          inputNode: 4,
        },
      ],
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 3,
          inputNode: 2,
        },
      ],
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 5,
          inputNode: 4,
        },
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 2,
          inputNode: 4,
        },
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 4,
          inputNode: 6,
        },
      ],
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 5,
          inputNode: 4,
        },
      ],
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 7,
          inputNode: 6,
        },
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 4,
          inputNode: 6,
        },
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: -1,
          outputNode: 6,
          inputNode: 8,
        },
      ],
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 7,
          inputNode: 6,
        },
      ],
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 9,
          inputNode: 8,
        },
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 10,
          inputNode: 8,
        },
        {
          outputIndex: 0,
          inputIndex: -1,
          outputNode: 6,
          inputNode: 8,
        },
      ],
      out: [],
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 9,
          inputNode: 8,
        },
      ],
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 10,
          inputNode: 8,
        },
      ],
    },
  ],
}
