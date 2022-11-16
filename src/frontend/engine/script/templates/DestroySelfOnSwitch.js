export default {
  name: 'DestroySelfOnSwitch',
  nodes: [
    {
      type: 'OnSwitch',
      internalValues: [],
    },
    {
      type: 'DestroyEntity',
      internalValues: [],
    },
    {
      type: 'GetControlledEntity',
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
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 2,
          inputNode: 1,
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
          outputNode: 2,
          inputNode: 1,
        },
      ],
    },
  ],
}
