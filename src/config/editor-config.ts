import type { FilterSpeaker, LabelValue } from '@/model'
import type { IEditorConfig } from '@wangeditor/editor'
import type { BarSearchFilter } from '@/components/bar-search'
import type { Speaker } from '@/model'

type FetahFunction = (word: string) => Promise<LabelValue[]>
type FilterFetahFunction = (filter: BarSearchFilter) => Promise<LabelValue[]>
type FilterSpeakerFetahFunction = (filter: FilterSpeaker) => Promise<Speaker[]>

function resolveList<T>() {
  return () => Promise.resolve<T[]>([])
}

export type GlobalEditorConfig = ReturnType<typeof createGlobalEditorConfig>

export interface SSMLEditorConfig {
  editorConfig?: IEditorConfig
  handleError: (error: string) => void
  pinyin: {
    fetchData: FetahFunction
  }
  english: {
    fetchData: FetahFunction
  }
  bgm: {
    menus?: LabelValue[]
    fetchScene: () => Promise<LabelValue[]>
    fetchStyle: () => Promise<LabelValue[]>
    fetchData: FilterFetahFunction
  }
  special: {
    menus?: LabelValue[]
    fetchScene: () => Promise<LabelValue[]>
    fetchStyle: () => Promise<LabelValue[]>
    fetchData: FilterFetahFunction
  }
  tryPlay: {
    gender?: LabelValue[]
    category?: LabelValue[]
    flags?: LabelValue[]
    fetchData: FilterSpeakerFetahFunction
    featchTag: () => Promise<LabelValue[]>
    fetchFlag: (flag: string) => Promise<Speaker[]>
    fetchStar: (speaker: string, star: boolean) => Promise<boolean>
  }
}

export function createGlobalEditorConfig(config?: SSMLEditorConfig) {
  const editorConfig = config?.editorConfig || { maxLength: 5000, placeholder: '请输入内容...' }
  const handleError = config?.handleError || (() => {})
  const pinyin = config?.pinyin || { fetchData: resolveList<LabelValue>() }
  const english = config?.english || { fetchData: resolveList<LabelValue>() }
  const special = config?.special || {
    fetchData: resolveList<LabelValue>(),
    fetchScene: resolveList<LabelValue>(),
    fetchStyle: resolveList<LabelValue>(),
  }
  const bgm = config?.bgm || {
    fetchData: resolveList<LabelValue>(),
    fetchScene: resolveList<LabelValue>(),
    fetchStyle: resolveList<LabelValue>(),
  }
  const tryPlay = config?.tryPlay || {
    fetchData: resolveList<FilterSpeaker>(),
    featchTag: resolveList<LabelValue>(),
    fetchStar: resolveList<LabelValue>(),
    fetchFlag: resolveList<LabelValue>(),
  }

  const specialRequired = special as Required<SSMLEditorConfig['special']>
  const bgmRequired = bgm as Required<SSMLEditorConfig['bgm']>
  const tryPlayRequired = tryPlay as Required<SSMLEditorConfig['tryPlay']>

  specialRequired.menus ??= [
    { label: '默认音效', value: '' },
    { label: '自定义音效', value: 'custom' },
    { label: '最近音效', value: 'history' },
  ]

  bgmRequired.menus ??= [
    { label: '默认配乐', value: '' },
    { label: '自定义配乐', value: 'custom' },
    { label: '最近配乐', value: 'history' },
  ]

  tryPlayRequired.gender ??= [
    { label: '全部', value: '' },
    { label: '男声', value: '男' },
    { label: '女声', value: '女' },
  ]

  tryPlayRequired.category ??= [
    { label: '热榜', value: '' },
    { label: 'SVIP', value: 'SVIP' },
    { label: '付费', value: '付费' },
  ]

  tryPlayRequired.flags ??= [
    { label: '常用', value: '常用' },
    { label: '已购', value: '已购' },
    { label: '收藏', value: '收藏' },
    { label: '我的', value: '我的' },
  ]

  return {
    editorConfig,
    handleError,
    pinyin,
    english,
    bgm: bgmRequired,
    special: specialRequired,
    tryPlay: tryPlayRequired,
  }
}
