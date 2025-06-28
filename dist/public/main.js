'use strict'; {
  const cfg = HFS.getPluginConfig()
  const STYLE_ID = 'hfs-disable-actions-style'
  const TAP_HIGHLIGHT_STYLE_ID = 'hfs-disable-tap-highlight'
  const PULL_REFRESH_STYLE_ID = 'hfs-disable-pull-refresh'

  function isLoggedIn() {
    return !!HFS.state.username
  }

  function isAllowed(settingKey) {
    return isLoggedIn() && cfg[settingKey]
  }

  // 🔒 禁用右鍵邏輯
  function updateRightClick() {
    document.removeEventListener('contextmenu', preventRightClick, true)
    if (!isAllowed('disableRightClick')) {
      document.addEventListener('contextmenu', preventRightClick, true)
    }
  }

  function preventRightClick(e) {
    e.stopPropagation()
    e.preventDefault()
  }

  // 🔒 禁用文字選取邏輯
  function updateTextSelection() {
    let style = document.getElementById(STYLE_ID)
    if (style) style.remove()
    if (!isAllowed('disableTextSelection')) {
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

  // 🔥 新增：永久禁用點擊高亮（無論登錄狀態）
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

  // 🆕 新增：禁用下拉刷新功能
  function updatePullToRefresh() {
    let style = document.getElementById(PULL_REFRESH_STYLE_ID)
    if (style) style.remove()
    if (cfg.disablePullToRefresh) {
      style = document.createElement('style')
      style.id = PULL_REFRESH_STYLE_ID
      style.textContent = `
        body {
          overscroll-behavior-y: contain !important;
        }
      `
      document.head.appendChild(style)
    }
  }

  // 🔒 控制檔案/資料夾菜單顯示邏輯（保持原有方案）
  function setupMenuControl() {
    const blockMenuIfNeeded = () => {
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

  // 🌀 隱藏滾動條（無論登入狀態）
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

  // 🟢 初始化
  function init() {
    disableTapHighlight() // 始終禁用點擊高亮
    updateRightClick()
    updateTextSelection()
    updatePullToRefresh() // 初始化下拉刷新設置
  }

  HFS.watchState('username', init, true)
  setupMenuControl()
  init() // 立即執行

  // 監聽配置變化
  HFS.onEvent('configChanged', init)
}