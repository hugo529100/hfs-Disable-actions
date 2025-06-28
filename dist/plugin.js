exports.version = 1.4
exports.apiRequired = 8.65
exports.description = "Restrict UI for guests: lock actions until login, optionally hide scrollbar"
exports.repo = "Hug3O/Disable-actions"
exports.frontend_js = 'main.js'

exports.config = {
  disableRightClick: {
    type: 'boolean',
    label: 'Enable right-click after login',
    defaultValue: true,
    frontend: true
  },
  disableTextSelection: {
    type: 'boolean',
    label: 'Enable text selection after login',
    defaultValue: true,
    frontend: true
  },
  blockMenusWhenLoggedIn: {
    type: 'boolean',
    label: 'Enable file/folder menu after login',
    defaultValue: true,
    frontend: true
  },
  hideScrollbar: {
    type: 'boolean',
    label: 'Hide scrollbar (independent of login)',
    defaultValue: true,
    frontend: true
  },
  disablePullToRefresh: {
    type: 'boolean',
    label: 'Disable pull-to-refresh (mobile browsers)',
    defaultValue: true,
    frontend: true
  }
}

exports.configDialog = {
  sx: { maxWidth: '28em' }
}