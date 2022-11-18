export default {
  "name": "SetTimeOnSwitch",
  "nodes": [
    {
      "type": "OnSwitch",
      "internalValues": []
    },
    {
      "type": "SetEntityVariable",
      "internalValues": []
    },
    {
      "type": "GetControlledEntity",
      "internalValues": []
    },
    {
      "type": "ExportVariable",
      "internalValues": [
        "timer",
        "timer"
      ]
    },
    {
      "type": "GetTime",
      "internalValues": []
    }
  ],
  "edges": [
    {
      "in": [],
      "out": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 1
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 1
        },
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 1
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 3,
          "inputNode": 1
        },
        {
          "outputIndex": 0,
          "inputIndex": 2,
          "outputNode": 4,
          "inputNode": 1
        }
      ],
      "out": []
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 1
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 3,
          "inputNode": 1
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 2,
          "outputNode": 4,
          "inputNode": 1
        }
      ]
    }
  ]
}