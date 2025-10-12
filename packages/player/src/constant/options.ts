import type { RequiredPlayerOptions } from '@root/types/options'

import { EMPTY_CALLBACK } from '@root/utils'

export const DEFAULT_PLAYER_OPTIONS: RequiredPlayerOptions = {
  offset: 150,
  speed: 1,
  onLinePlay: EMPTY_CALLBACK,
  onSetLyric: EMPTY_CALLBACK,
} as const
