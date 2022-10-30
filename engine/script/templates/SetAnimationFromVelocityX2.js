export default {
  "name": "SetAnimationFromVelocityX2",
  "nodes": [
    {
      "type": "IsZero",
      "internalValues": []
    },
    {
      "type": "OnRender",
      "internalValues": []
    },
    {
      "type": "ControlledVelX",
      "internalValues": []
    },
    {
      "type": "SetControlledAnimation#",
      "internalValues": [
        4
      ]
    },
    {
      "type": "SetControlledAnimation#",
      "internalValues": [
        3
      ]
    },
    {
      "type": "SetControlledAnimation#",
      "internalValues": [
        5
      ]
    },
    {
      "type": "Less#",
      "internalValues": [
        0
      ]
    }
  ],
  "edges": [
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 0
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 3
        },
        {
          "outputIndex": 1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 6
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 1,
          "inputNode": 2
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 1,
          "inputNode": 2
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 0
        },
        {
          "outputIndex": 0,
          "inputIndex": 0,
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
          "outputNode": 0,
          "inputNode": 3
        }
      ],
      "out": []
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 6,
          "inputNode": 4
        }
      ],
      "out": []
    },
    {
      "in": [
        {
          "outputIndex": 1,
          "inputIndex": -1,
          "outputNode": 6,
          "inputNode": 5
        }
      ],
      "out": []
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 6
        },
        {
          "outputIndex": 1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 6
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 6,
          "inputNode": 4
        },
        {
          "outputIndex": 1,
          "inputIndex": -1,
          "outputNode": 6,
          "inputNode": 5
        }
      ]
    }
  ]
}