export namespace Lyric {
  export interface Time {
    /** start time (ms) */
    start: number
    /** end time (ms) */
    end: number
    /** time duration (ms) */
    duration: number
  }

  export interface Config {
    /** is instrumental music (may) */
    isInstrumental: boolean
    /** is support auto scroll lyric (no lyric time info) */
    isSupportAutoScroll: boolean
  }

  export namespace Group {
    export interface LineInfo {
      /** group id (crc32) */
      id: string
      /** group index */
      index: {
        /** index in global */
        global: number
        /** index in this block */
        block: number
      }
    }

    export interface Item {
      /** group id (crc32) */
      id: string
      /** group name */
      name: string
      /** group total line */
      total: number
    }
  }

  export namespace Meta {
    export interface Producer {
      role: {
        raw: string
        /** replaced */
        parsed: string
      }
      name: {
        raw: string
        /** splitted with "/" */
        parsed: string[]
      }
    }
    export interface Info {
      /** offset of the song */
      offset: number
      /** title of the song */
      title?: string
      /** album of the song */
      album?: string
      /** duration of the song */
      duration?: {
        raw: string
        /** parsed time (ms) */
        parsed: number
      }
      /** artist of the song */
      artist?: {
        raw: string
        /** splitted with "/" */
        parsed: string[]
      }
      /** lyricist of the song */
      lyricist?: {
        raw: string
        /** splitted with "/" */
        parsed: string[]
      }
      /** author of the song */
      author?: {
        raw: string
        /** splitted with "/" */
        parsed: string[]
      }
      /** contributor of the lyric */
      contributor?: {
        raw: string
        /** splitted with "/" */
        parsed: string[]
      }
      /** producers of the song */
      producer?: Producer[]
    }
  }

  export namespace Line {
    export type Type = 'NORMAL' | 'INTERLUDE'

    export namespace Dynamic {
      export interface Word {
        /** time info (relative to the time of this lyrics) */
        time: Time
        /** text contents */
        text: string
        /** dynamic word config */
        config: {
          /** need space in word start, if line postion in right, you need use it */
          needSpaceStart: boolean
          /** need space in word end, if line postion in left, you need use it */
          needSpaceEnd: boolean
          /** long tail sound */
          needTrailing: boolean
        }
      }
      export interface Info {
        /** time info (relative to the time of this lyrics) */
        time: Time
        /** dynamic words */
        words: Word[]
      }
    }

    export interface Info {
      /** lyric line type */
      type: Type
      /** time info (relative to the time of this lyrics) */
      time: Time
      /** belong to a duet group id */
      group: Group.LineInfo
      /** line content */
      content: {
        /** original text */
        original: string
        /** translated text */
        translate?: string
        /** roman text */
        roman?: string
        /** dynamic content */
        dynamic?: Dynamic.Info
      }
    }

    export type ContentKey = keyof Info['content']
  }

  export interface Info {
    /** lyric meta */
    meta: Meta.Info
    /** lyric lines */
    lines: Line.Info[]
    /** lyric groups */
    groups: Group.Item[]
    /** lyric config */
    config: Config
  }
}
