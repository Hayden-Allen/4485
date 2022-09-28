export default {
  "name": "Move",
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
      "type": "Subtract",
      "internalValues": []
    },
    {
      "type": "Vec2",
      "internalValues": []
    },
    {
      "type": "Normalize",
      "internalValues": []
    },
    {
      "type": "Mux2",
      "internalValues": []
    },
    {
      "type": "ScaleVec2",
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
        "keyRun",
        "Shift"
      ]
    },
    {
      "type": "ExportInt",
      "internalValues": [
        "speedWalk",
        5
      ]
    },
    {
      "type": "ExportInt",
      "internalValues": [
        "speedRun",
        10
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
        "d"
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
        "a"
      ]
    },
    {
      "type": "VarKeyPressed",
      "internalValues": []
    },
    {
      "type": "ExportKey",
      "internalValues": [
        "keyDown",
        "s"
      ]
    },
    {
      "type": "VarKeyPressed",
      "internalValues": []
    },
    {
      "type": "ExportKey",
      "internalValues": [
        "keyUp",
        "w"
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
          "inputNode": 9
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 13
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 15
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 17
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 19
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 13,
          "inputNode": 1
        },
        {
          "outputIndex": 2,
          "inputIndex": 1,
          "outputNode": 15,
          "inputNode": 1
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 3
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 2,
          "inputIndex": 1,
          "outputNode": 17,
          "inputNode": 2
        },
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 19,
          "inputNode": 2
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
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
          "outputNode": 1,
          "inputNode": 3
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 2,
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
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 4,
          "inputNode": 6
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 9,
          "inputNode": 5
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 11,
          "inputNode": 5
        },
        {
          "outputIndex": 0,
          "inputIndex": 2,
          "outputNode": 12,
          "inputNode": 5
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 5,
          "inputNode": 6
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 4,
          "inputNode": 6
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 5,
          "inputNode": 6
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 6,
          "inputNode": 8
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
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 6,
          "inputNode": 8
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
          "inputNode": 9
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 9
        }
      ],
      "out": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 9,
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
          "outputNode": 10,
          "inputNode": 9
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 11,
          "inputNode": 5
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 2,
          "outputNode": 12,
          "inputNode": 5
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 14,
          "inputNode": 13
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 13
        }
      ],
      "out": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 13,
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
          "outputNode": 14,
          "inputNode": 13
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 16,
          "inputNode": 15
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 15
        }
      ],
      "out": [
        {
          "outputIndex": 2,
          "inputIndex": 1,
          "outputNode": 15,
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
          "outputNode": 16,
          "inputNode": 15
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 18,
          "inputNode": 17
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 17
        }
      ],
      "out": [
        {
          "outputIndex": 2,
          "inputIndex": 1,
          "outputNode": 17,
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
          "outputNode": 18,
          "inputNode": 17
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 20,
          "inputNode": 19
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 19
        }
      ],
      "out": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 19,
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
          "outputNode": 20,
          "inputNode": 19
        }
      ]
    }
  ]
}