export default {
  "name": "PlatformerMove2",
  "nodes": [
    {
      "type": "OnTick",
      "internalValues": []
    },
    {
      "type": "Subtract",
      "internalValues": []
    },
    {
      "type": "Mux2",
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
        "keyRun",
        "Shift"
      ]
    },
    {
      "type": "VarKeyPressed",
      "internalValues": []
    },
    {
      "type": "ExportKey",
      "internalValues": [
        "keyRight",
        "D"
      ]
    },
    {
      "type": "VarKeyPressed",
      "internalValues": []
    },
    {
      "type": "ExportKey",
      "internalValues": [
        "keyLeft",
        "A"
      ]
    },
    {
      "type": "Multiply",
      "internalValues": []
    },
    {
      "type": "ApplyEntityForce",
      "internalValues": []
    },
    {
      "type": "Vec2",
      "internalValues": []
    },
    {
      "type": "ConstInt",
      "internalValues": [
        0
      ]
    },
    {
      "type": "ExportFloat",
      "internalValues": [
        "speedWalk",
        0.1
      ]
    },
    {
      "type": "ExportFloat",
      "internalValues": [
        "speedRun",
        0.2
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
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 6
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 8
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 6,
          "inputNode": 1
        },
        {
          "outputIndex": 2,
          "inputIndex": 1,
          "outputNode": 8,
          "inputNode": 1
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 10
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 4,
          "inputNode": 2
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 14,
          "inputNode": 2
        },
        {
          "outputIndex": 0,
          "inputIndex": 2,
          "outputNode": 15,
          "inputNode": 2
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 2,
          "inputNode": 10
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
          "inputNode": 11
        }
      ]
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
          "outputNode": 5,
          "inputNode": 4
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 7,
          "inputNode": 6
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 6
        }
      ],
      "out": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 6,
          "inputNode": 1
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 7,
          "inputNode": 6
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 9,
          "inputNode": 8
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 8
        }
      ],
      "out": [
        {
          "outputIndex": 2,
          "inputIndex": 1,
          "outputNode": 8,
          "inputNode": 1
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 9,
          "inputNode": 8
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 10
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 2,
          "inputNode": 10
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 10,
          "inputNode": 12
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 3,
          "inputNode": 11
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 12,
          "inputNode": 11
        }
      ],
      "out": []
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 10,
          "inputNode": 12
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 13,
          "inputNode": 12
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 12,
          "inputNode": 11
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 13,
          "inputNode": 12
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 14,
          "inputNode": 2
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 2,
          "outputNode": 15,
          "inputNode": 2
        }
      ]
    }
  ]
}