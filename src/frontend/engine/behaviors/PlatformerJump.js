export default {
  "name": "PlatformerJump",
  "nodes": [
    {
      "type": "OnTick",
      "internalValues": []
    },
    {
      "type": "Vec2",
      "internalValues": []
    },
    {
      "type": "GetControlledEntity",
      "internalValues": []
    },
    {
      "type": "SetEntityVelocity",
      "internalValues": []
    },
    {
      "type": "VarKeyPressed",
      "internalValues": []
    },
    {
      "type": "ExportKey",
      "internalValues": [
        "keyJump",
        " "
      ]
    },
    {
      "type": "GetControlledEntity",
      "internalValues": []
    },
    {
      "type": "GetEntityVelocity",
      "internalValues": []
    },
    {
      "type": "Vec2Components",
      "internalValues": []
    },
    {
      "type": "Mux2",
      "internalValues": []
    },
    {
      "type": "ExportInt",
      "internalValues": [
        "jumpHeight",
        10
      ]
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
          "inputNode": 4
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 8,
          "inputNode": 1
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 9,
          "inputNode": 1
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 1,
          "inputNode": 3
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 3
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 3
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 1,
          "inputNode": 3
        }
      ],
      "out": []
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 5,
          "inputNode": 4
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 4
        }
      ],
      "out": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 4,
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
          "outputNode": 5,
          "inputNode": 4
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
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
          "outputNode": 6,
          "inputNode": 7
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 7,
          "inputNode": 8
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 7,
          "inputNode": 8
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 8,
          "inputNode": 1
        },
        {
          "outputIndex": 1,
          "inputIndex": 1,
          "outputNode": 8,
          "inputNode": 9
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 1,
          "inputIndex": 1,
          "outputNode": 8,
          "inputNode": 9
        },
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 4,
          "inputNode": 9
        },
        {
          "outputIndex": 0,
          "inputIndex": 2,
          "outputNode": 10,
          "inputNode": 9
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 9,
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
          "outputNode": 10,
          "inputNode": 9
        }
      ]
    }
  ]
}