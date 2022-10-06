export default {
  name: 'PlatformerJump',
  nodes: [
    {
      type: 'Vec2',
      internalValues: [],
    },
    {
      type: 'GetControlledEntity',
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
      internalValues: ['jumpHeight', 1],
    },
    {
      type: 'OnSwitch',
      internalValues: [],
    },
    {
      type: 'ConstVec2',
      internalValues: [0, 1],
    },
    {
      type: 'OnCollide',
      internalValues: [],
    },
    {
      type: 'Vec2Equals',
      internalValues: [],
    },
    {
      type: 'GetControlledEntity',
      internalValues: [],
    },
    {
      type: 'ExportState',
      internalValues: ['landState', 'default'],
    },
    {
      type: 'SetEntityState',
      internalValues: [],
    },
  ],
  edges: [
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 3,
          inputNode: 0,
        },
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 4,
          inputNode: 0,
        },
        {
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 5,
          inputNode: 0,
        },
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 0,
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
          outputNode: 0,
          inputNode: 2,
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
          outputNode: 3,
          inputNode: 0,
        },
      ],
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 4,
          inputNode: 0,
        },
      ],
    },
    {
      in: [],
      out: [
        {
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 5,
          inputNode: 0,
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
          inputNode: 8,
        },
      ],
    },
    {
      in: [],
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
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 6,
          inputNode: 8,
        },
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: -1,
          outputNode: 8,
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
          inputIndex: 1,
          outputNode: 10,
          inputNode: 11,
        },
      ],
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: -1,
          outputNode: 8,
          inputNode: 11,
        },
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 9,
          inputNode: 11,
        },
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 10,
          inputNode: 11,
        },
      ],
      out: [],
    },
  ],
}
