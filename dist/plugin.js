exports.version = 1.6
exports.apiRequired = 8.65
exports.description = "Restrict UI for guests: lock actions until login, optionally hide scrollbar"
exports.repo = "Hug3O/Disable-actions"
exports.frontend_js = 'main.js'

exports.config = {
  // 右键点击控制组
  enableRightClickControl: {
    type: 'boolean',
    label: 'Disable right-click ',
    defaultValue: true,
    frontend: true
  },
  disableRightClick: {
    type: 'boolean',
    label: 'Enable right-click after login',
    defaultValue: true,
    frontend: true,
    dependsOn: value => value.enableRightClickControl
  },

  // 文本选择控制组
  enableTextSelectionControl: {
    type: 'boolean',
    label: 'Disable text selection ',
    defaultValue: true,
    frontend: true
  },
  disableTextSelection: {
    type: 'boolean',
    label: 'Enable text selection after login',
    defaultValue: true,
    frontend: true,
    dependsOn: value => value.enableTextSelectionControl
  },

  // 菜单控制组
  enableMenuControl: {
    type: 'boolean',
    label: 'Disable files/folder menu',
    defaultValue: true,
    frontend: true
  },
  blockMenusWhenLoggedIn: {
    type: 'boolean',
    label: 'Enable file/folder menu after login',
    defaultValue: true,
    frontend: true,
    dependsOn: value => value.enableMenuControl
  },

  // 独立功能
  hideScrollbar: {
    type: 'boolean',
    label: 'Hide scrollbar (independent of login)',
    defaultValue: true,
    frontend: true
  }
}

exports.configDialog = {
  sx: { maxWidth: '28em' }
}