export class ScriptGraphVisualizer {
  constructor(graph) {
    this.graph = graph
  }
  /**
   * @HATODO render to separate framebuffer?
   */
  arrangeX() {
    const order = this.graph.compile()
    let index = new Map()
    let slices = []

    order.forEach((node) => {
      const inboundEdges = this.graph.edges.get(node.id).in
      // be default, put nodes in the first slice
      let slice = 0
      if (inboundEdges.length) {
        let maxSlice = 0
        inboundEdges.forEach(
          (edge) =>
            (maxSlice = Math.max(maxSlice, index.get(edge.outputNode.id)))
        )
        // put this node one slice right of its rightmost parent
        slice = maxSlice + 1
      }

      if (!slices[slice]) slices[slice] = new Map()
      slices[slice].set(node.id, node)
      index.set(node.id, slice)
    })

    // shift nodes in slice 0 as far right as they can go
    order.forEach((node) => {
      const currentSlice = index.get(node.id)
      if (currentSlice != 0) return

      const outboundEdges = this.graph.edges.get(node.id).out
      let minSlice = slices.length
      outboundEdges.forEach(
        (edge) => (minSlice = Math.min(minSlice, index.get(edge.inputNode.id)))
      )
      // put this node one slice left of its leftmost child
      const slice = minSlice - 1
      slices[currentSlice].delete(node.id)
      slices[slice].set(node.id, node)
      index.set(node.id, slice)
    })

    let output = []
    slices.forEach((slice) => {
      let cur = []
      slice.forEach((node) => {
        cur.push(node.debugName)
      })
      output.push(cur)
    })
    return output
  }
}
