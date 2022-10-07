export default {
  "name": "ChangeStateOnKey",
  "nodes": [
    {
      "type": "OnTick",
      "internalValues": []
    },
    {
      "type": "GetControlledEntity",
      "internalValues": []
    },
    {
      "type": "VarKeyPressed",
      "internalValues": []
    },
    {
      "type": "ExportKey",
      "internalValues": [
        "key",
        "A"
      ]
    },
    {
      "type": "ExportState",
      "internalValues": [
        "state",
        "default"
      ]
    },
    {
      "type": "SetEntityState",
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
          "inputNode": 2
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 5
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 3,
          "inputNode": 2
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 2
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 2,
          "inputNode": 5
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 3,
          "inputNode": 2
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 4,
          "inputNode": 5
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 5
        },
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 2,
          "inputNode": 5
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 4,
          "inputNode": 5
        }
      ],
      "out": []
    }
  ]
}