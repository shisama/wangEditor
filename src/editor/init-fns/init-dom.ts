/**
 * @description 初始化编辑器 DOM 结构
 * @author wangfupeng
 */

import Editor from '../index'
import $, { DomElement } from '../../utils/dom-core'
import { getRandom } from '../../utils/util'

const styleSettings = {
    border: '1px solid #c9d8db',
    toolbarBgColor: '#FFF',
    toolbarBottomBorder: '1px solid #EEE',
}

export default function (editor: Editor): void {
    const toolbarSelector = editor.toolbarSelector
    const $toolbarSelector = $(toolbarSelector)
    const textSelector = editor.textSelector

    const config = editor.config
    const height = config.height
    const i18next = editor.i18next

    const $toolbarElem: DomElement = $('<div></div>')
    const $textContainerElem: DomElement = $('<div></div>')
    let $textElem: DomElement
    let $children: DomElement | null
    let $wrap: DomElement | null = null

    if (textSelector == null) {
        // 将编辑器区域原有的内容，暂存起来
        $children = $toolbarSelector.children()

        // 添加到 DOM 结构中
        $toolbarSelector.append($toolbarElem).append($textContainerElem)

        // 自行创建的，需要配置默认的样式
        $toolbarElem
            .css('background-color', styleSettings.toolbarBgColor)
            .css('border', styleSettings.border)
            .css('border-bottom', styleSettings.toolbarBottomBorder)
        $textContainerElem
            .css('border', styleSettings.border)
            .css('border-top', 'none')
            .css('height', `${height}px`)
    } else {
        // toolbarSelector 和 textSelector 都有
        $toolbarSelector.append($toolbarElem)
        $(textSelector).append($textContainerElem)
        // 将编辑器区域原有的内容，暂存起来
        $children = $textContainerElem.children()
        // 菜单编辑区域分离，包裹他们的容器中，可能会有用户定义的初始化内容，先暂存起来
        $wrap = $toolbarSelector.parent()
    }

    // 编辑区域
    $textElem = $('<div></div>')
    $textElem.attr('contenteditable', 'true').css('width', '100%').css('height', '100%')

    // 添加 placeholder
    const $placeholder = $(`<div>${i18next.t(editor.config.placeholder)}</div>`)
    $placeholder.addClass('placeholder')

    // 处理菜单和编辑区域分离，用户在父容器设置自定义内容
    if (textSelector !== null && $wrap && $wrap.text()) {
        // 获取用户自定义的内容，根据换行切割
        $wrap
            .text()
            .split('\n')
            .forEach(text => {
                text.trim() && $textElem.append($(`<p>${text}<br></p>`))
            })
        // 移除多余内容，只保留toolbar 和 text
        $wrap
            .childNodes()
            ?.elems.slice(0, -2)
            .forEach(el => {
                el.nodeType === 3 && (el.textContent = '')
                $(el).remove()
            })
        // 编辑器有默认值的时候隐藏placeholder
        $placeholder.hide()
    }

    // 初始化编辑区域内容
    if ($children && $children.length) {
        $textElem.append($children)
        // 编辑器有默认值的时候隐藏placeholder
        $placeholder.hide()
    } else {
        $textElem.append($('<p><br></p>')) // 新增一行，方便继续编辑
    }

    // 编辑区域加入DOM
    $textContainerElem.append($textElem)

    // 添加placeholder
    $textContainerElem.append($placeholder)

    // 设置通用的 class
    $toolbarElem.addClass('w-e-toolbar').css('z-index', editor.zIndex.get('toolbar'))
    $textContainerElem.addClass('w-e-text-container')
    $textContainerElem.css('z-index', editor.zIndex.get())
    $textElem.addClass('w-e-text')

    // 添加 ID
    const toolbarElemId = getRandom('toolbar-elem')
    $toolbarElem.attr('id', toolbarElemId)
    const textElemId = getRandom('text-elem')
    $textElem.attr('id', textElemId)

    // 判断编辑区与容器高度是否一致
    const textContainerCliheight = $textContainerElem.getClientHeight()
    const textElemClientHeight = $textElem.getClientHeight()
    if (textContainerCliheight !== textElemClientHeight) {
        $textElem.css('min-height', textContainerCliheight + 'px')
    }

    // 记录属性
    editor.$toolbarElem = $toolbarElem
    editor.$textContainerElem = $textContainerElem
    editor.$textElem = $textElem
    editor.toolbarElemId = toolbarElemId
    editor.textElemId = textElemId
}
