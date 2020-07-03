/* eslint-disable @typescript-eslint/explicit-function-return-type */

module.exports = {
  webpack: (config, {isServer}) => {
    if (!isServer) config.node = {fs: "empty"}
    return config
  },
}
