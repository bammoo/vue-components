let currentHandle = null
let currentLine

export const getUploadFunction = () => {
  return (editor) => {
    const cm = editor.codemirror
    let pos = cm.getCursor()
    cm.setSelection(pos, pos)
    setTimeout(() => {
      cm.replaceSelection('image-url')
      cm.focus()
    }, 300)
  }
}

export const getHeadingFunction = (type) => {  
  const label = type === 3 ? '### ' : (type === 4 ? '#### ' : '##### ')

  return function (editor) {
    const cm = editor.codemirror
    let line = cm.getCursor().line
    const content = cm.doc.getLine(line)
    if (line == currentLine) {
      cm.setSelection({line, ch: 0}, {line, ch:label.length})
      currentLine = null
      cm.replaceSelection('');
      cm.setCursor(line, content.length)
    }
    else {
      cm.setSelection({line, ch: 0}, {line, ch: content.length})
      cm.replaceSelection(label + content);
      currentLine = line;
    }
    cm.focus()
    return

    // let pos = cm.getCursor();
    // console.log('pos', pos)

    // // var output = '';
    // var selectedText = cm.getSelection();
    // if(!selectedText) {
    //   selectedText = 
    // }

    // // output = '####' + text;
    // // cm.replaceSelection(output);
    // cm.focus()
    // cm.setCursor(cm.lineCount(),0)
    // console.log('cm.lineCount()', cm.lineCount())
  }
}
