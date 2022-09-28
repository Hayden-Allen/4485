export default {
  name: 'PlatformerJump',
  nodes: [
    {
      type: 'OnTick',
      internalValues: [],
    },
    {
      type: 'Vec2',
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
      internalValues: ['keyJump', ' '],
    },
    {
      type: 'Mux2',
      internalValues: [],
    },
    {
      type: 'ApplyEntityForce',
      internalValues: [],
    },
    {
      type: 'ConstInt',
      internalValues: [0],
    },
    {
      type: 'ExportFloat',
      internalValues: ['jumpHeight', 0.025],
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
          inputNode: 3,
        },
      ],
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 5,
          inputNode: 1,
        },
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 7,
          inputNode: 1,
        },
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 1,
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
          outputNode: 2,
          inputNode: 6,
        },
      ],
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 4,
          inputNode: 3,
        },
        {
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 0,
          inputNode: 3,
        },
      ],
      out: [
        {
          outputIndex: 2,
          inputIndex: 0,
          outputNode: 3,
          inputNode: 5,
        },
      ],
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 4,
          inputNode: 3,
        },
      ],
    },
    {
      in: [
        {
          outputIndex: 2,
          inputIndex: 0,
          outputNode: 3,
          inputNode: 5,
        },
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 7,
          inputNode: 5,
        },
        {
          outputIndex: 0,
          inputIndex: 2,
          outputNode: 8,
          inputNode: 5,
        },
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 5,
          inputNode: 1,
        },
      ],
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 2,
          inputNode: 6,
        },
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 1,
          inputNode: 6,
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
          outputNode: 7,
          inputNode: 1,
        },
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 7,
          inputNode: 5,
        },
      ],
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 2,
          outputNode: 8,
          inputNode: 5,
        },
      ],
    },
  ],
}
