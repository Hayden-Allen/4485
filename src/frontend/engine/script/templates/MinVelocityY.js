export default {
  name: 'MinVelocityY',
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
      type: 'GetEntityVelocity',
      internalValues: [],
    },
    {
      type: 'GetControlledEntity',
      internalValues: [],
    },
    {
      type: 'ExportFloat',
      internalValues: ['minVelocity', -5],
    },
    {
      type: 'Vec2Components',
      internalValues: [],
    },
    {
      type: 'SetEntityVelocityY',
      internalValues: [],
    },
    {
      type: 'Max',
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
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 2,
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
          outputNode: 3,
          inputNode: 6,
        },
      ],
    },
    {
      in: [
        {
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 0,
          inputNode: 4,
        },
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 4,
          inputNode: 7,
        },
      ],
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 2,
          inputNode: 5,
        },
      ],
      out: [
        {
          outputIndex: 1,
          inputIndex: 0,
          outputNode: 5,
          inputNode: 7,
        },
      ],
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 3,
          inputNode: 6,
        },
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 7,
          inputNode: 6,
        },
      ],
      out: [],
    },
    {
      in: [
        {
          outputIndex: 1,
          inputIndex: 0,
          outputNode: 5,
          inputNode: 7,
        },
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 4,
          inputNode: 7,
        },
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 7,
          inputNode: 6,
        },
      ],
    },
  ],
}
