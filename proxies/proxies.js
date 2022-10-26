import { proxy } from 'valtio'

import GameWrapper from '%proxies/GameWrapper.js'

export const gameProxy = proxy(new GameWrapper())
