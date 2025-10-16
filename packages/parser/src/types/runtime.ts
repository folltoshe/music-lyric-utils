import { Lyric } from '@music-lyric-utils/shared'

export interface ParserProps {
  original?: string
  translate?: string
  roman?: string
  dynamic?: string
}

export interface MatchItem {
  raw: string
  tag: string
  content: string
}

export interface MatchInfo {
  meta: MatchItem[]
  line: MatchItem[]
}
