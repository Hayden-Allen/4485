export default {
  "name": "PongMove",
  "nodes": [
    {
      "type": "OnTick",
      "internalValues": []
    },
    {
      "type": "VarKeyPressed",
      "internalValues": []
    },
    {
      "type": "ExportKey",
      "internalValues": [
        "keyUp",
        "W"
      ]
    },
    {
      "type": "ExportKey",
      "internalValues": [
        "keyDown",
        "S"
      ]
    },
    {
      "type": "VarKeyPressed",
      "internalValues": []
    },
    {
      "type": "Subtract",
      "internalValues": []
    },
    {
      "type": "ExportFloat",
      "internalValues": [
        "export",
        1
      ]
    },
    {
      "type": "Multiply",
      "internalValues": []
    },
    {
      "type": "GetControlledEntity",
      "internalValues": []
    },
    {
      "type": "SetEntityVelocityY",
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
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 3
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 6
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 1
        }
      ],
      "out": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 5
        }
      ]
    },
    {
      "in": [
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
          "inputIndex": 0,
          "outputNode": 2,
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
          "inputNode": 3
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 3,
          "inputNode": 4
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 3,
          "inputNode": 4
        }
      ],
      "out": [
        {
          "outputIndex": 2,
          "inputIndex": 1,
          "outputNode": 4,
          "inputNode": 5
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 5
        },
        {
          "outputIndex": 2,
          "inputIndex": 1,
          "outputNode": 4,
          "inputNode": 5
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 5,
          "inputNode": 7
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 6
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 6,
          "inputNode": 7
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 5,
          "inputNode": 7
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 6,
          "inputNode": 7
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 7,
          "inputNode": 9
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 8,
          "inputNode": 9
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 8,
          "inputNode": 9
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 7,
          "inputNode": 9
        }
      ],
      "out": []
    }
  ]
}