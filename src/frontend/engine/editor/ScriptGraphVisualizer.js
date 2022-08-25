import { ScriptGraphProxy } from './ScriptGraphProxy.js'

export class ScriptGraphVisualizer {
  constructor(ctx, graph) {
    this.graph = graph
    this.slices = []

    this.proxies = new Map()
    this.graph.nodes.forEach((node) =>
      this.proxies.set(node.id, new ScriptGraphProxy(ctx, node, 0, 0))
    )
  }
  draw(window, ox, oy) {
    this.proxies.forEach((proxy) => proxy.draw(window, ox, oy))
    this.graph.nodes.forEach((node) => {
      const outboundEdges = this.graph.edges.get(node.id).out
      outboundEdges.forEach((edge) => {
        const sproxy = this.proxies.get(edge.outputNode.id)
        const sx = sproxy.x + sproxy.w
        let sy = 0
        if (node.outputTypes.length)
          sy =
            sproxy.y +
            sproxy.h * ((edge.outputIndex + 1) / (node.outputTypes.length + 1))
        else sy = sproxy.y + sproxy.h / 2

        const eproxy = this.proxies.get(edge.inputNode.id)
        const ex = eproxy.x
        const ey =
          eproxy.y +
          ((edge.inputIndex + 1) / (edge.inputNode.inputTypes.length + 1)) *
            eproxy.h

        window.drawLine(
          sx + ox,
          sy + oy,
          ex + ox,
          ey + oy,
          edge.inputIndex === -1 ? '#f00' : '#000',
          { width: 1.5 }
        )
      })
    })
  }
  /**
   * @HATODO render to separate framebuffer?
   */
  arrangeX() {
    const padding = 75
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

    // compute starting point on x-axis for each column
    let basex = [0]
    for (var i = 0; i < slices.length; i++) {
      let maxWidth = 0
      slices[i].forEach(
        (node) => (maxWidth = Math.max(this.proxies.get(node.id).w, maxWidth))
      )
      basex[i + 1] = basex[i] + maxWidth + padding
    }

    // update proxies
    this.proxies.forEach((proxy) => {
      proxy.x = basex[index.get(proxy.node.id)]
    })

    this.slices = slices
  }
  arrangeY() {
    const padding = 25
    let slices = this.slices
    let maxHeight = 0

    // find maximum slice height
    let heights = []
    slices.forEach((slice) => {
      let height = 0
      slice.forEach((node) => (height += this.proxies.get(node.id).h))
      height += padding * (slice.size - 1)
      heights.push(height)
      maxHeight = Math.max(maxHeight, height)
    })

    // initially, arrange only last slice
    const heightStep = maxHeight / (slices[slices.length - 1].size + 1)
    let index = 0
    slices[slices.length - 1].forEach((node) => {
      let proxy = this.proxies.get(node.id)
      proxy.y = heightStep * (index + 1) - proxy.h / 2
      index++
    })

    let sortedSlices = []
    // based on that, arrange all other slices
    let children = new Map()
    for (var i = slices.length - 2; i >= 0; i--) {
      slices[i].forEach((parent) => {
        let c = []
        const outboundEdges = this.graph.edges.get(parent.id).out
        outboundEdges.forEach((edge) => {
          c.push(edge.inputNode)
        })
        children.set(parent.id, c)
      })
      let sorted = []
      slices[i].forEach((parent) => {
        let avgy = 0
        if (!children.has(parent.id)) return
        let c = children.get(parent.id)
        c.forEach((child) => {
          avgy += this.proxies.get(child.id).y
          /**
           * @HATODO slow
           */
          const port = this.graph.edges
            .get(child.id)
            .in.find((edge) => edge.outputNode.id === parent.id).inputIndex
          if (port > -1) avgy += port
        })
        avgy /= c.length
        sorted.push({ y: avgy, node: parent })
      })
      sortedSlices[i] = sorted = sorted.sort((a, b) => a.y - b.y)

      // update proxies
      let bottom = 0
      const basey = maxHeight / (slices[i].size + 1)
      sorted.forEach((o, i) => {
        let proxy = this.proxies.get(o.node.id)
        if (i === 0) {
          proxy.y = basey - proxy.h / 2
        } else {
          proxy.y = Math.max(bottom + padding, o.y - proxy.h / 2)
        }
        bottom = proxy.y + proxy.h
      })
    }
    // second pass (left to right)
    // eslint-disable-next-line no-redeclare
    for (var i = 1; i < slices.length - 1; i++) {
      const sorted = sortedSlices[i]
      if (sorted.length === 1) {
        this.proxies.get(sorted[0].node.id).y = this.computeAverageParentY(
          i,
          sorted,
          0
        )
      } else {
        for (var j = sorted.length - 1; j > 0; j--) {
          const child = sorted[j].node
          let proxy = this.proxies.get(child.id)
          const above = this.proxies.get(sorted[j - 1].node.id)

          const avgy = this.computeAverageParentY(i, sorted, j)

          if (avgy >= above.y + above.h + padding) {
            if (j < sorted.length - 1) {
              const below = this.proxies.get(sorted[j + 1].node.id)
              if (avgy + proxy.h <= below.y - padding) proxy.y = avgy
            } else proxy.y = avgy
          }
        }
      }
    }
  }
  computeAverageParentY(slice, sorted, index) {
    const child = sorted[index].node

    let parents = []
    this.slices[slice - 1].forEach((parent) => {
      const outboundEdges = this.graph.edges.get(parent.id).out
      outboundEdges.forEach((edge) => {
        if (edge.inputNode.id === child.id) parents.push(parent)
      })
    })
    let avgy = 0
    parents.forEach((parent) => (avgy += this.proxies.get(parent.id).y))
    return avgy / parents.length
  }
}
