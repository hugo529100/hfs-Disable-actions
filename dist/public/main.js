'use strict'; {
  const cfg = HFS.getPluginConfig()
  const STYLE_ID = 'hfs-disable-actions-style'
  const TAP_HIGHLIGHT_STYLE_ID = 'hfs-disable-tap-highlight'

  function isLoggedIn() {
    return !!HFS.state.username
  }

  function isAllowed(settingKey, controlKey) {
    return !cfg[controlKey] || (isLoggedIn() && cfg[settingKey])
  }

  // 🔒 禁用右键逻辑
  function updateRightClick() {
    document.removeEventListener('contextmenu', preventRightClick, true)
    if (cfg.enableRightClickControl && !isAllowed('disableRightClick', 'enableRightClickControl')) {
      document.addEventListener('contextmenu', preventRightClick, true)
    }
  }

  function preventRightClick(e) {
    e.stopPropagation()
    e.preventDefault()
  }

  // 🔒 禁用文字选取逻辑
  function updateTextSelection() {
    let style = document.getElementById(STYLE_ID)
    if (style) style.remove()
    if (cfg.enableTextSelectionControl && !isAllowed('disableTextSelection', 'enableTextSelectionControl')) {
      style = document.createElement('style')
      style.id = STYLE_ID
      style.textContent = `
        * {
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
        }
      `
      document.head.appendChild(style)
    }
  }

  // 🔥 永久禁用点击高亮
  function disableTapHighlight() {
    let style = document.getElementById(TAP_HIGHLIGHT_STYLE_ID)
    if (!style) {
      style = document.createElement('style')
      style.id = TAP_HIGHLIGHT_STYLE_ID
      style.textContent = `
        * {
          -webkit-tap-highlight-color: transparent !important;
          tap-highlight-color: transparent !important;
        }
      `
      document.head.appendChild(style)
    }
  }

  // 控制文件/文件夹菜单显示逻辑
  function setupMenuControl() {
    const blockMenuIfNeeded = () => {
      if (!cfg.enableMenuControl) return
      
      const loggedIn = isLoggedIn()
      const allowMenu = loggedIn && cfg.blockMenusWhenLoggedIn
      if (allowMenu) return

      setTimeout(() => {
        document.querySelectorAll('.dialog-backdrop, .dialog').forEach(el => {
          const title = el.querySelector?.('.dialog-title')?.textContent?.toLowerCase()
          if (title?.includes('file menu') || title?.includes('folder menu')) {
            el.remove()
            document.body.style.overflow = ''
            document.body.removeAttribute('aria-hidden')
          }
        })
      }, 30)
      return null
    }

    HFS.onEvent('fileMenu', blockMenuIfNeeded)
    HFS.onEvent('folderMenu', blockMenuIfNeeded)
  }

  // 隐藏滚动条
  if (cfg.hideScrollbar) {
    const css = document.createElement('style')
    css.textContent = `
      ::-webkit-scrollbar {
        display: none;
      }
      html, body {
        scrollbar-width: none;
        -ms-overflow-style: none;
        overflow: -moz-scrollbars-none;
      }
    `
    document.head.appendChild(css)
  }

  // 初始化
  function init() {
    disableTapHighlight()
    updateRightClick()
    updateTextSelection()
  }

  HFS.watchState('username', init, true)
  setupMenuControl()
  init()

  // 监听配置变化
  HFS.onEvent('configChanged', init)
}