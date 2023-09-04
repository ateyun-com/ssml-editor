import { h, type VNode } from 'snabbdom'
import { SlateElement, type IDomEditor, SlateTransforms, DomEditor } from '@wangeditor/editor'
import type { CustomManagement } from './custom-types'
import { throttle } from 'lodash'
import { removeNodeSpace } from '../helper'
import { WANGEDITOR_EVENT } from '@/constant'

export default {
  type: 'custom-management',
  renderElem: (elem: SlateElement, children: VNode[] | null, editor: IDomEditor) => {
    const { remark } = elem as CustomManagement
    return h('span.ssml-wrapper', [
      h(
        `span.remark`,
        {
          props: { contentEditable: false },
          style: {
            backgroundColor: 'var(--custom-management)',
          },
          on: {
            mousedown: (event: Event) => event.preventDefault(),
            click: throttle((event: Event) => {
              event.preventDefault()
              editor.select(DomEditor.findPath(editor, elem))
              editor.emit(WANGEDITOR_EVENT.SSML_ELEMENT_CLICK, editor, elem)
            }),
          },
        },
        [
          h(`span.iconfont.icon-roundclosefill`, {
            on: {
              click: throttle((event: Event) => {
                event.preventDefault()
                const path = DomEditor.findPath(editor, elem)
                removeNodeSpace(editor, path)
                SlateTransforms.unwrapNodes(editor, { at: path })
              }),
            },
          }),
          h(`span.data-content`, { attrs: { 'data-content': remark } }),
        ],
      ),
      h(`span.data-content`, {
        props: { contentEditable: false },
        attrs: { 'data-content': '{{' },
        style: { color: `var(--custom-management)` },
      }),
      h('span', children),
      h(`span.data-content`, {
        props: { contentEditable: false },
        attrs: { 'data-content': '}}' },
        style: { color: 'var(--custom-management)' },
      }),
    ])
  },
}
