export default {
  "name": "PongBall",
  "nodes": [
    {
      "type": "OnCollide",
      "internalValues": []
    },
    {
      "type": "Vec2Components",
      "internalValues": []
    },
    {
      "type": "IsNonZero",
      "internalValues": []
    },
    {
      "type": "GetControlledEntity",
      "internalValues": []
    },
    {
      "type": "Multiply",
      "internalValues": []
    },
    {
      "type": "ConstInt",
      "internalValues": [
        -1
      ]
    },
    {
      "type": "GetControlledEntity",
      "internalValues": []
    },
    {
      "type": "Multiply",
      "internalValues": []
    },
    {
      "type": "ConstInt",
      "internalValues": [
        -1
      ]
    },
    {
      "type": "GetEntityVariableInt",
      "internalValues": [
        "ydir"
      ]
    },
    {
      "type": "EntitySetVariable",
      "internalValues": [
        "ydir"
      ]
    },
    {
      "type": "GetEntityVariableInt",
      "internalValues": [
        "xdir"
      ]
    },
    {
      "type": "EntitySetVariable",
      "internalValues": [
        "xdir"
      ]
    },
    {
      "type": "OnTick",
      "internalValues": []
    },
    {
      "type": "SetEntityVelocityX",
      "internalValues": []
    },
    {
      "type": "SetEntityVelocityY",
      "internalValues": []
    },
    {
      "type": "GetControlledEntity",
      "internalValues": []
    },
    {
      "type": "GetEntityVariableInt",
      "internalValues": [
        "ydir"
      ]
    },
    {
      "type": "GetControlledEntity",
      "internalValues": []
    },
    {
      "type": "GetEntityVariableInt",
      "internalValues": [
        "xdir"
      ]
    }
  ],
  "edges": [
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 0,
          "inputNode": 1
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 0,
          "inputNode": 1
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 2
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 2
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 2,
          "inputNode": 3
        },
        {
          "outputIndex": 1,
          "inputIndex": -1,
          "outputNode": 2,
          "inputNode": 6
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 2,
          "inputNode": 3
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 3,
          "inputNode": 11
        },
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 3,
          "inputNode": 12
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 5,
          "inputNode": 4
        },
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 11,
          "inputNode": 4
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 4,
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
          "outputNode": 5,
          "inputNode": 4
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 1,
          "inputIndex": -1,
          "outputNode": 2,
          "inputNode": 6
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 6,
          "inputNode": 10
        },
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 6,
          "inputNode": 9
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 8,
          "inputNode": 7
        },
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 9,
          "inputNode": 7
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 7,
          "inputNode": 10
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 8,
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
          "inputNode": 9
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 9,
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
          "inputNode": 10
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 7,
          "inputNode": 10
        }
      ],
      "out": []
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 3,
          "inputNode": 11
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 11,
          "inputNode": 4
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 4,
          "inputNode": 12
        },
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 3,
          "inputNode": 12
        }
      ],
      "out": []
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 13,
          "inputNode": 16
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 13,
          "inputNode": 18
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 19,
          "inputNode": 14
        },
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 18,
          "inputNode": 14
        }
      ],
      "out": []
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
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 17,
          "inputNode": 15
        }
      ],
      "out": []
    },
    {
      "in": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 13,
          "inputNode": 16
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 16,
          "inputNode": 15
        },
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 16,
          "inputNode": 17
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 16,
          "inputNode": 17
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 17,
          "inputNode": 15
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 13,
          "inputNode": 18
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 18,
          "inputNode": 19
        },
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 18,
          "inputNode": 14
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 18,
          "inputNode": 19
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 19,
          "inputNode": 14
        }
      ]
    }
  ]
}