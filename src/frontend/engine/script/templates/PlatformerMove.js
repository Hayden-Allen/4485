export default {
  name: 'PlatformerMove',
  nodes: [
    {
      type: 'OnTick',
      internalValues: [],
    },
    {
      type: 'Subtract',
      internalValues: [],
    },
    {
      type: 'Mux2',
      internalValues: [],
    },
    {
      type: 'GetControlledEntity',
      internalValues: [],
    },
    {
      type: 'VarKeyPressed',
      internalValues: [],
    },
    {
      type: 'ExportKey',
      internalValues: ['keyRun', 'Shift'],
    },
    {
      type: 'ExportInt',
      internalValues: ['speedWalk', 5],
    },
    {
      type: 'ExportInt',
      internalValues: ['speedRun', 10],
    },
    {
      type: 'VarKeyPressed',
      internalValues: [],
    },
    {
      type: 'ExportKey',
      internalValues: ['keyRight', 'D'],
    },
    {
      type: 'VarKeyPressed',
      internalValues: [],
    },
    {
      type: 'ExportKey',
      internalValues: ['keyLeft', 'A'],
    },
    {
      type: 'SetEntityVelocityX',
      internalValues: [],
    },
    {
      type: 'Multiply',
      internalValues: [],
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
          inputNode: 4,
        },
        {
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 0,
          inputNode: 8,
        },
        {
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 0,
          inputNode: 10,
        },
      ],
    },
    {
      in: [
        {
          outputIndex: 2,
          inputIndex: 0,
          outputNode: 8,
          inputNode: 1,
        },
        {
          outputIndex: 2,
          inputIndex: 1,
          outputNode: 10,
          inputNode: 1,
        },
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 1,
          inputNode: 13,
        },
      ],
    },
    {
      in: [
        {
          outputIndex: 2,
          inputIndex: 0,
          outputNode: 4,
          inputNode: 2,
        },
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 6,
          inputNode: 2,
        },
        {
          outputIndex: 0,
          inputIndex: 2,
          outputNode: 7,
          inputNode: 2,
        },
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 2,
          inputNode: 13,
        },
      ],
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 3,
          inputNode: 12,
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
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 0,
          inputNode: 4,
        },
      ],
      out: [
        {
          outputIndex: 2,
          inputIndex: 0,
          outputNode: 4,
          inputNode: 2,
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
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 6,
          inputNode: 2,
        },
      ],
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 2,
          outputNode: 7,
          inputNode: 2,
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
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 0,
          inputNode: 8,
        },
      ],
      out: [
        {
          outputIndex: 2,
          inputIndex: 0,
          outputNode: 8,
          inputNode: 1,
        },
      ],
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
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 11,
          inputNode: 10,
        },
        {
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 0,
          inputNode: 10,
        },
      ],
      out: [
        {
          outputIndex: 2,
          inputIndex: 1,
          outputNode: 10,
          inputNode: 1,
        },
      ],
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 11,
          inputNode: 10,
        },
      ],
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 3,
          inputNode: 12,
        },
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 13,
          inputNode: 12,
        },
      ],
      out: [],
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 1,
          inputNode: 13,
        },
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 2,
          inputNode: 13,
        },
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 13,
          inputNode: 12,
        },
      ],
    },
  ],
}
