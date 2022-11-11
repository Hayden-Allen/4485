export default {
  "name": "CameraFollow",
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
      "type": "GetEntityPosition",
      "internalValues": []
    },
    {
      "type": "SetCameraPosition",
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
        }
      ],
      "out": []
    }
  ]
}