const { createEditor, createToolbar } = window.wangEditor 
const editorConfig = {
  placeholder: '文章内容',
  onChange(editor) {
    const html = editor.getHtml()
    console.log('editor content', html)
    // 也可以同步到 <textarea>
    document.querySelector(".content_area").innerHTML=html;
  },
}
const editor = createEditor({
  selector: '#editor-container',
  html: '<p><br></p>',
  config: editorConfig,
  mode: 'default', // or 'simple'
})
const toolbarConfig = {}
const toolbar = createToolbar({
  editor,
  selector: '#toolbar-container',
  config: toolbarConfig,
  mode: 'default', // or 'simple'
})