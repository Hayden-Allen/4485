export default {
  "name": "SetAnimationFromVelocityX",
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
      "type": "LessConst",
      "internalValues": [
        0
      ]
    },
    {
      "type": "SetControlledEntityAnimationConst",
      "internalValues": [
        4
      ]
    },
    {
      "type": "SetControlledEntityAnimationConst",
      "internalValues": [
        3
      ]
    },
    {
      "type": "SetControlledEntityAnimationConst",
      "internalValues": [
        5
      ]
    },
    {
      "type": "GetControlledEntityVelocityX",
      "internalValues": []
    }
  ],
  "edges": [
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 6,
          "inputNode": 0
        }
      ],
      "out": [
        {
          "outputIndex": 1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 2
        },
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 3
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
          "inputNode": 6
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 2
        },
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 6,
          "inputNode": 2
        }
      ],
      "out": [
        {
          "outputIndex": 1,
          "inputIndex": -1,
          "outputNode": 2,
          "inputNode": 5
        },
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 2,
          "inputNode": 4
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
          "outputNode": 2,
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
          "outputNode": 2,
          "inputNode": 5
        }
      ],
      "out": []
    },
    {
      "in": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 1,
          "inputNode": 6
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 6,
          "inputNode": 0
        },
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 6,
          "inputNode": 2
        }
      ]
    }
  ]
}