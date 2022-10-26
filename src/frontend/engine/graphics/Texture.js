import { global } from '%engine/Global.js'

// maps url to image
let imageCache = new Map()

export class Texture {
  constructor(gl, frameTime, urls) {
    this.resizeCanvas = document.createElement('canvas')
    this.resizeCtx = this.resizeCanvas.getContext('2d')
    this.texture = gl.createTexture()
    this.frame = 0
    this.frameCount = urls.length
    this.frameTime = frameTime
    this.lastSwitch = 0
    // placeholder while image loads
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.texture)
    this.createEmptyTexture(gl, 1, 1, 1)

    let images = []
    let bufferData = () => {
      let maxWidth = 0,
        maxHeight = 0
      images.forEach((image) => {
        maxWidth = Math.max(maxWidth, image.width)
        maxHeight = Math.max(maxHeight, image.height)
      })

      gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.texture)
      this.createEmptyTexture(gl, maxWidth, maxHeight, urls.length)
      images.forEach((image, i) => {
        /**
         * @HATODO find a better way to do this
         */
        this.resizeCanvas.width = maxWidth
        this.resizeCanvas.height = maxHeight
        this.resizeCtx.clearRect(0, 0, maxWidth, maxHeight)
        this.resizeCtx.drawImage(image, 0, 0, maxWidth, maxHeight)

        gl.texSubImage3D(
          gl.TEXTURE_2D_ARRAY,
          0,
          0,
          0,
          i,
          this.resizeCanvas.width,
          this.resizeCanvas.height,
          1,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          this.resizeCanvas
        )
      })

      gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    }

    let loadCount = 0
    let tryLoad = (url, img) => {
      loadCount++
      if (loadCount === urls.length) bufferData()
      // this may result in some images being loaded twice, but avoids the problem of incomplete images being added to the cache
      if (!imageCache.has(url)) imageCache.set(url, img)
    }
    urls.forEach((url) => {
      if (imageCache.has(url)) {
        const cachedImage = imageCache.get(url)
        images.push(cachedImage)
        tryLoad()
      } else {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => tryLoad(url, img)
        img.src = url
        images.push(img)
      }
    })

    /**
     * @HATODO move this ??
     * needed by StatesPanelItemAnimation.svelte
     */
    this.urls = urls
  }
  createEmptyTexture(gl, w, h, d) {
    gl.texImage3D(
      gl.TEXTURE_2D_ARRAY,
      0,
      gl.RGBA,
      w,
      h,
      d,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      undefined
    )
  }
  bind(gl, slot) {
    gl.activeTexture(gl.TEXTURE0 + slot)
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.texture)

    /**
     * @HATODO hacky?
     */
    if (
      !global.context.paused &&
      this.frameCount > 1 &&
      global.time.now - this.lastSwitch >= this.frameTime
    ) {
      this.frame = (this.frame + 1) % this.frameCount
      this.lastSwitch = global.time.now
    }
  }
  reset() {
    this.lastSwitch = global.time.now
    this.frame = 0
  }
}
