const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: ['./src'],
    prependData: `@import "styles/variables.sass"`,
  }
}

module.exports = nextConfig
