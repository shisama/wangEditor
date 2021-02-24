/**
 * @description 创建编辑器实例
 * @author wangfupeng
 */

import createEditor from '../../helpers/create-editor'

test('创建一个编辑器实例', () => {
    const editor = createEditor(document, 'div1')
    expect(editor.id).not.toBeNull()
})

test('创建一个编辑器实例，toolbar 和 text 分离', () => {
    const editor = createEditor(document, 'div1', 'div2')
    expect(editor.id).not.toBeNull()
})

test('一个页面创建多个编辑器实例', () => {
    const editor1 = createEditor(document, 'div1')
    const editor2 = createEditor(document, 'div2')
    expect(editor1.id).not.toBeNull()
    expect(editor2.id).not.toBeNull()
})

test('创建一个编辑器实例，toolbar 和 text 分离，且包裹容器内有初始的内容能代入编辑区域', () => {
    const editor = createEditor(
        document,
        'div1',
        'div2',
        {},
        `<div>测试下</div>这里来一段没有包裹标签的文字<div>测试结束</div>`
    )
    expect(editor.id).not.toBeNull()
    expect(editor.txt.text()).not.toBe('')
})
