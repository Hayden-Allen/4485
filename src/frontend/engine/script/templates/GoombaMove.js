export default {
  "name": "GoombaMove",
  "nodes": [
    {
      "type": "OnTick",
      "internalValues": []
    },
    {
      "type": "ExportFloat",
      "internalValues": [
        "velocityX",
        3
      ]
    },
    {
      "type": "GetControlledEntity",
      "internalValues": []
    },
    {
      "type": "SetEntityVelocityX",
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
    }
  ]
}