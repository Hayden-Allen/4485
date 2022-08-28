import { ScriptGraphProxy, PORT_COLOR } from './ScriptGraphProxy.js'

const PADDING_X = 100,
  PADDING_Y = 50
export class ScriptGraphVisualizer {
  constructor(window, graph) {
    this.graph = graph
    this.columns = []
    // map ScriptNode.id to its ScriptGraphProxy
    this.proxies = new Map()
    // mantains draw order as nodes are selected
    this.drawStack = []
    this.graph.nodes.forEach((node) => {
      const proxy = new ScriptGraphProxy(window, node)
      this.proxies.set(node.id, proxy)
      this.drawStack.push(proxy)
    })
    this.activationEdgeColor = '#facc15'
    this.edgeWidth = 2
  }
  draw(window, zoom) {
    // draw edges
    this.graph.nodes.forEach((node) => {
      const outboundEdges = this.graph.getEdges(node).out
      outboundEdges.forEach((edge) => {
        const startCoords = this.proxies
          .get(edge.outputNode.id)
          .getOutPortCoords(edge.outputIndex)
        const endCoords = this.proxies
          .get(edge.inputNode.id)
          .getInPortCoords(edge.inputIndex)

        let color = undefined
        // if the current edge only carries activation
        if (
          edge.inputIndex === -1 ||
          !edge.outputNode.data.outputPorts.length
        ) {
          color = this.activationEdgeColor
        } else {
          // get scaled coordinates
          const [sx, sy] = window.transformCoords(startCoords.x, startCoords.y)
          const [ex, ey] = window.transformCoords(endCoords.x, endCoords.y)
          // draw the line using a gradient between the two port's colors
          color = window.ctx.createLinearGradient(sx, sy, ex, ey)
          const outType =
            edge.outputNode.data.outputPorts[edge.outputIndex].typename
          const inType =
            edge.inputNode.data.inputPorts[edge.inputIndex].typename
          color.addColorStop(0, PORT_COLOR[outType].edge)
          color.addColorStop(1, PORT_COLOR[inType].edge)
        }

        window.drawLine(
          startCoords.x,
          startCoords.y,
          endCoords.x,
          endCoords.y,
          color,
          { width: this.edgeWidth }
        )
      })
    })
    // move selected node if necessary
    let selectedIndex = -1
    for (var i = 0; i < this.drawStack.length - 1; i++)
      if (this.drawStack[i].selected) selectedIndex = i
    if (selectedIndex !== -1) {
      const [selected] = this.drawStack.splice(selectedIndex, 1)
      this.drawStack.push(selected)
    }
    // draw nodes
    this.drawStack.forEach((proxy) => proxy.draw(window, zoom))
  }
  arrange() {
    let columns = []
    // x-axis
    {
      const order = this.graph.compile()
      let columnIndex = new Map()

      // traverse nodes in topological order; this corresponds to left->right visual order
      order.forEach((node) => {
        const inboundEdges = this.graph.getEdges(node).in
        // By default, put nodes in the first column. This means that any nodes with no input ports will start at the very left of the graph. This is fixed in the next pass, when all nodes are shifted as far right as possible
        let column = 0
        if (inboundEdges.length) {
          let maxColumn = 0
          inboundEdges.forEach((edge) => {
            // find the rightmost parent of the current node
            maxColumn = Math.max(maxColumn, columnIndex.get(edge.outputNode.id))
          })
          // put current node one column right of rightmost parent
          column = maxColumn + 1
        }

        // create new column if necessary
        if (!columns[column]) columns[column] = new Map()
        // add current node to column
        columns[column].set(node.id, node)
        columnIndex.set(node.id, column)
      })

      // push no-input nodes as far right as they can go (see above comment)
      order.forEach((node) => {
        const currentColumn = columnIndex.get(node.id)
        // this node has inputs, so is already in the correct column
        if (currentColumn != 0) return

        const outboundEdges = this.graph.getEdges(node).out
        let minColumn = columns.length
        // find the leftmost child of the current node
        outboundEdges.forEach((edge) => {
          minColumn = Math.min(minColumn, columnIndex.get(edge.inputNode.id))
        })
        // put current node one column left of leftmost child
        const newColumn = minColumn - 1
        if (newColumn != currentColumn) {
          columns[currentColumn].delete(node.id)
          columns[newColumn].set(node.id, node)
          columnIndex.set(node.id, newColumn)
        }
      })

      // compute x-axis starting point for each column (first column starts at 0)
      let baseX = [0]
      for (var i = 0; i < columns.length; i++) {
        // compute the maximum width of all nodes in current column
        let maxWidth = 0
        columns[i].forEach((node) => {
          maxWidth = Math.max(maxWidth, this.proxies.get(node.id).w)
        })
        // baseX of next column is baseX of current column + maxWidth of current column
        baseX[i + 1] = baseX[i] + maxWidth + PADDING_X
      }

      // update proxies with new x values (all proxies within a column are left-justified)
      this.proxies.forEach((proxy) => {
        proxy.x = baseX[columnIndex.get(proxy.node.id)]
      })
    }
    //y-axis
    {
      let heights = []
      let maxHeight = 0
      // compute maximum column height
      columns.forEach((column) => {
        let height = 0
        column.forEach((node) => {
          height += this.proxies.get(node.id).h
        })
        // there are (n - 1) gaps between nodes in a column
        height += PADDING_Y * (column.size - 1)
        // cache this column's height
        heights.push(height)
        maxHeight = Math.max(maxHeight, height)
      })

      // compute y positions for rightmost column
      const lastColumn = columns[columns.length - 1]
      // evenly space across the entire column height
      const heightStep = maxHeight / (lastColumn.size + 1)
      let nodesTraversed = 0
      lastColumn.forEach((node) => {
        let proxy = this.proxies.get(node.id)
        proxy.y = heightStep * (nodesTraversed + 1) - proxy.h / 2
        nodesTraversed++
      })

      // each column's nodes sorted by y coord
      let sortedColumns = []
      // for each node, store a list of its children
      let children = new Map()
      // arrange other columns in right->left order
      for (let i = columns.length - 2; i >= 0; i--) {
        // get list of children for each node in current column
        columns[i].forEach((parent) => {
          let currentChildren = []
          const outboundEdges = this.graph.getEdges(parent).out
          outboundEdges.forEach((edge) => {
            currentChildren.push(edge.inputNode)
          })
          children.set(parent.id, currentChildren)
        })
        // assign y values to all nodes in current column based on their children
        let sortedColumn = []
        columns[i].forEach((parent) => {
          let averageY = 0
          let currentChildren = children.get(parent.id)
          currentChildren.forEach((child) => {
            // base y of current child
            averageY += this.proxies.get(child.id).y
            // account for the port of the current child the current parent is attached to
            const port = this.graph
              .getEdges(child)
              .in.find((edge) => edge.outputNode.id === parent.id).inputIndex
            averageY += port
          })
          averageY /= currentChildren.length
          sortedColumn.push({ y: averageY, node: parent })
        })
        // sort all nodes in current column based on their current y value
        // NOTE: this produces a correct ordering, but the current y values are not necessarily used, see below
        sortedColumn = sortedColumn.sort((a, b) => a.y - b.y)
        sortedColumns[i] = sortedColumn

        // update proxies
        let bottomY = 0
        sortedColumn.forEach((object, index) => {
          let proxy = this.proxies.get(object.node.id)
          // set the first node to the first evenly spaced position
          if (index === 0) {
            proxy.y = maxHeight / (columns[i].size + 1) - proxy.h / 2
          } else {
            // attempt to set following nodes to their position based on the previous step, but snap to the bottom of the last node if necessary
            proxy.y = Math.max(bottomY + PADDING_Y, object.y - proxy.h / 2)
          }
          bottomY = proxy.y + proxy.h
        })
      }

      // second pass (left to right); attempt to set y position of all proxies to the average y of all their parents (this provides a nice layout)
      // eslint-disable-next-line no-redeclare
      for (let i = 1; i < columns.length - 1; i++) {
        const sorted = sortedColumns[i]
        // if there's only one node in current column, set it to the ideal position (average of its parents)
        if (sorted.length === 1) {
          this.proxies.get(sorted[0].node.id).y = this.computeAverageParentY(
            columns,
            i,
            sorted[0].node
          )
        }
        // if there are multiple nodes in current column, try to set them to their ideal positions, but prevent overlapping with other nodes
        else {
          // attempt to reposition proxies from bottom to top
          for (var j = sorted.length - 1; j > 0; j--) {
            let currentProxy = this.proxies.get(sorted[j].node.id)
            const aboveProxy = this.proxies.get(sorted[j - 1].node.id)
            const averageY = this.computeAverageParentY(
              columns,
              i,
              sorted[j].node
            )

            // if the ideal position is sufficiently beneath the proxy above
            if (averageY >= aboveProxy.y + aboveProxy.h + PADDING_Y) {
              // this is not the bottom proxy, must check it against the one below it as well
              if (j < sorted.length - 1) {
                const belowProxy = this.proxies.get(sorted[j + 1].node.id)
                if (belowProxy.y >= averageY + currentProxy.h + PADDING_Y)
                  currentProxy.y = averageY
              }
              // if this is the bottom proxy, there's nothing below for it to intersect
              else {
                currentProxy.y = averageY
              }
            }
          }
        }
      }
    }
  }
  computeAverageParentY(columns, column, child) {
    // find all parents of given node
    let parents = []
    columns[column - 1].forEach((parent) => {
      const outboundEdges = this.graph.getEdges(parent).out
      outboundEdges.forEach((edge) => {
        if (edge.inputNode.id === child.id) parents.push(parent)
      })
    })
    let avgy = 0
    parents.forEach((parent) => (avgy += this.proxies.get(parent.id).y))
    return avgy / parents.length
  }
}
