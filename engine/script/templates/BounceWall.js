export default {
  name: 'BounceWall',
  nodes: [
    {
      type: 'OnCollide',
      internalValues: [],
    },
    {
      type: 'Vec2Components',
      internalValues: [],
    },
    {
      type: 'NOT',
      internalValues: [],
    },
    {
      type: 'AND',
      internalValues: [],
    },
    {
      type: 'EqualsConst',
      internalValues: [0],
    },
    {
      type: 'EqualsConst',
      internalValues: [0],
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
      type: 'Vec2Components',
      internalValues: [],
    },
    {
      type: 'Negative',
      internalValues: [],
    },
    {
      type: 'GetControlledEntity',
      internalValues: [],
    },
    {
      type: 'SetEntityVelocityX',
      internalValues: [],
    },
  ],
  edges: [
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 0,
          inputNode: 1,
        },
      ],
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 0,
          inputNode: 1,
        },
      ],
      out: [
        {
          outputIndex: 1,
          inputIndex: 0,
          outputNode: 1,
          inputNode: 5,
        },
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 1,
          inputNode: 4,
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
      ],
      out: [
        {
          outputIndex: 2,
          inputIndex: 0,
          outputNode: 2,
          inputNode: 3,
        },
      ],
    },
    {
      in: [
        {
          outputIndex: 2,
          inputIndex: 0,
          outputNode: 2,
          inputNode: 3,
        },
        {
          outputIndex: 2,
          inputIndex: 1,
          outputNode: 5,
          inputNode: 3,
        },
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: -1,
          outputNode: 3,
          inputNode: 7,
        },
      ],
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 1,
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
      in: [
        {
          outputIndex: 1,
          inputIndex: 0,
          outputNode: 1,
          inputNode: 5,
        },
      ],
      out: [
        {
          outputIndex: 2,
          inputIndex: 1,
          outputNode: 5,
          inputNode: 3,
        },
      ],
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 6,
          inputNode: 7,
        },
      ],
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 6,
          inputNode: 7,
        },
        {
          outputIndex: 0,
          inputIndex: -1,
          outputNode: 3,
          inputNode: 7,
        },
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 7,
          inputNode: 8,
        },
      ],
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 7,
          inputNode: 8,
        },
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 8,
          inputNode: 9,
        },
      ],
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 8,
          inputNode: 9,
        },
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 9,
          inputNode: 11,
        },
      ],
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 10,
          inputNode: 11,
        },
      ],
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 9,
          inputNode: 11,
        },
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 10,
          inputNode: 11,
        },
      ],
      out: [],
    },
  ],
}
