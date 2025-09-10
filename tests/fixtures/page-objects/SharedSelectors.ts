// Common selectors used across multiple page objects
export const SharedSelectors = {
  // Loading states
  loading: {
    spinner: '[data-testid="loading"], .loading, .spinner',
    overlay: '[data-testid="loading-overlay"], .loading-overlay',
    skeleton: '[data-testid="skeleton"], .skeleton',
    progressBar: '[data-testid="progress"], .progress',
  },

  // Buttons
  buttons: {
    primary: '[data-testid="primary-button"], .btn-primary',
    secondary: '[data-testid="secondary-button"], .btn-secondary',
    cancel: '[data-testid="cancel-button"], .btn-cancel, [aria-label="Cancel"]',
    close: '[data-testid="close-button"], .btn-close, [aria-label="Close"]',
    submit: '[type="submit"], [data-testid="submit-button"]',
    save: '[data-testid="save-button"], .btn-save',
    delete: '[data-testid="delete-button"], .btn-delete',
    edit: '[data-testid="edit-button"], .btn-edit',
    add: '[data-testid="add-button"], .btn-add',
  },

  // Form elements
  form: {
    input: 'input[type="text"], input[type="email"], input[type="password"]',
    textarea: 'textarea',
    select: 'select',
    checkbox: 'input[type="checkbox"]',
    radio: 'input[type="radio"]',
    fileInput: 'input[type="file"]',
    searchInput: '[data-testid="search-input"], input[placeholder*="search" i]',
    filterSelect: '[data-testid="filter-select"], select[data-filter]',
  },

  // Navigation
  navigation: {
    navbar: '[data-testid="navbar"], .navbar, nav',
    sidebar: '[data-testid="sidebar"], .sidebar',
    breadcrumb: '[data-testid="breadcrumb"], .breadcrumb',
    tabs: '[data-testid="tabs"], .tabs, [role="tablist"]',
    tab: '[data-testid="tab"], .tab, [role="tab"]',
    tabPanel: '[data-testid="tab-panel"], .tab-panel, [role="tabpanel"]',
  },

  // Modals and overlays
  modal: {
    container: '[data-testid="modal"], .modal, [role="dialog"]',
    overlay: '[data-testid="modal-overlay"], .modal-overlay, .backdrop',
    header: '[data-testid="modal-header"], .modal-header',
    title: '[data-testid="modal-title"], .modal-title, h1, h2, h3',
    content: '[data-testid="modal-content"], .modal-content, .modal-body',
    footer: '[data-testid="modal-footer"], .modal-footer',
    closeButton:
      '[data-testid="modal-close"], .modal-close, [aria-label="Close"]',
  },

  // Lists and tables
  list: {
    container: '[data-testid="list"], .list, ul, ol',
    item: '[data-testid*="item"], .list-item, li',
    emptyState: '[data-testid="empty-state"], .empty-state, .no-results',
    loadMore: '[data-testid="load-more"], .load-more',
  },

  table: {
    container: '[data-testid="table"], table',
    header: 'thead, [data-testid="table-header"]',
    body: 'tbody, [data-testid="table-body"]',
    row: 'tr, [data-testid*="row"]',
    cell: 'td, th, [data-testid*="cell"]',
    sortButton: '[data-testid*="sort"], .sortable, [aria-sort]',
  },

  // Notifications and alerts
  notification: {
    container: '[data-testid="notification"], .notification, .alert',
    success: '[data-testid="success"], .alert-success, .notification-success',
    error: '[data-testid="error"], .alert-error, .notification-error',
    warning: '[data-testid="warning"], .alert-warning, .notification-warning',
    info: '[data-testid="info"], .alert-info, .notification-info',
    closeButton: '[data-testid="notification-close"], .notification-close',
  },

  // Error states
  error: {
    message: '[data-testid="error-message"], .error-message, .field-error',
    container: '[data-testid="error"], .error, .has-error',
    inline: '.error, .field-error, .invalid-feedback',
    global: '[data-testid="global-error"], .global-error, .page-error',
  },

  // Pagination
  pagination: {
    container: '[data-testid="pagination"], .pagination',
    previous: '[data-testid="prev"], .prev, [aria-label*="previous" i]',
    next: '[data-testid="next"], .next, [aria-label*="next" i]',
    page: '[data-testid*="page"], .page-number',
    current: '.current, .active, [aria-current="page"]',
  },

  // Search and filters
  search: {
    container: '[data-testid="search"], .search',
    input:
      '[data-testid="search-input"], input[type="search"], input[placeholder*="search" i]',
    button: '[data-testid="search-button"], .search-button',
    clear: '[data-testid="clear-search"], .clear-search',
    results: '[data-testid="search-results"], .search-results',
  },

  filter: {
    container: '[data-testid="filters"], .filters',
    dropdown: '[data-testid*="filter"], select[data-filter]',
    checkbox: 'input[type="checkbox"][data-filter]',
    clear: '[data-testid="clear-filters"], .clear-filters',
    apply: '[data-testid="apply-filters"], .apply-filters',
  },

  // Status indicators
  status: {
    badge: '[data-testid*="status"], .status, .badge',
    new: '[data-status="new"], .status-new',
    contacted: '[data-status="contacted"], .status-contacted',
    qualified: '[data-status="qualified"], .status-qualified',
    unqualified: '[data-status="unqualified"], .status-unqualified',
  },

  // Drag and drop
  dragDrop: {
    draggable: '[draggable="true"], [data-draggable]',
    dropZone: '[data-drop-zone], .drop-zone',
    dragHandle: '[data-drag-handle], .drag-handle',
  },

  // Accessibility
  accessibility: {
    skipLink: '[data-testid="skip-link"], .skip-link',
    landmark:
      '[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]',
    heading: 'h1, h2, h3, h4, h5, h6',
    focusable:
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  },
};

// Utility functions for building selectors
export const SelectorUtils = {
  // Build a selector for a specific test ID
  testId: (id: string): string => `[data-testid="${id}"]`,

  // Build a selector for a specific test ID pattern
  testIdContains: (pattern: string): string => `[data-testid*="${pattern}"]`,

  // Build a selector for a specific test ID starting with pattern
  testIdStartsWith: (pattern: string): string => `[data-testid^="${pattern}"]`,

  // Build a selector for a specific test ID ending with pattern
  testIdEndsWith: (pattern: string): string => `[data-testid$="${pattern}"]`,

  // Combine multiple selectors with OR logic
  or: (...selectors: string[]): string => selectors.join(', '),

  // Build a selector for an element within another element
  within: (parent: string, child: string): string => `${parent} ${child}`,

  // Build a selector for a direct child
  directChild: (parent: string, child: string): string =>
    `${parent} > ${child}`,

  // Build a selector for an adjacent sibling
  adjacentSibling: (element: string, sibling: string): string =>
    `${element} + ${sibling}`,

  // Build a selector for a general sibling
  generalSibling: (element: string, sibling: string): string =>
    `${element} ~ ${sibling}`,

  // Build a selector with attribute
  withAttribute: (
    element: string,
    attribute: string,
    value?: string
  ): string => {
    if (value) {
      return `${element}[${attribute}="${value}"]`;
    }
    return `${element}[${attribute}]`;
  },

  // Build a selector with class
  withClass: (element: string, className: string): string =>
    `${element}.${className}`,

  // Build a selector for nth child
  nthChild: (element: string, n: number): string =>
    `${element}:nth-child(${n})`,

  // Build a selector for first child
  firstChild: (element: string): string => `${element}:first-child`,

  // Build a selector for last child
  lastChild: (element: string): string => `${element}:last-child`,

  // Build a selector for visible elements only
  visible: (element: string): string => `${element}:visible`,

  // Build a selector for hidden elements only
  hidden: (element: string): string => `${element}:hidden`,

  // Build a selector for enabled elements only
  enabled: (element: string): string => `${element}:enabled`,

  // Build a selector for disabled elements only
  disabled: (element: string): string => `${element}:disabled`,
};

// Common selector patterns for the Mini Seller Console
export const AppSelectors = {
  leads: {
    list: SelectorUtils.testId('leads-list'),
    item: SelectorUtils.testIdStartsWith('lead-'),
    searchInput: SelectorUtils.testId('leads-search'),
    statusFilter: SelectorUtils.testId('status-filter'),
    scoreSort: SelectorUtils.testId('score-sort'),
    emptyState: SelectorUtils.testId('leads-empty-state'),
    loading: SelectorUtils.testId('leads-loading'),
  },

  leadDetail: {
    panel: SelectorUtils.testId('lead-detail-panel'),
    nameField: SelectorUtils.testId('lead-name'),
    emailField: SelectorUtils.testId('lead-email'),
    statusSelect: SelectorUtils.testId('lead-status'),
    saveButton: SelectorUtils.testId('save-lead'),
    cancelButton: SelectorUtils.testId('cancel-lead'),
    convertButton: SelectorUtils.testId('convert-lead'),
  },

  opportunities: {
    list: SelectorUtils.testId('opportunities-list'),
    item: SelectorUtils.testIdStartsWith('opportunity-'),
    table: SelectorUtils.testId('opportunities-table'),
    emptyState: SelectorUtils.testId('opportunities-empty-state'),
  },
};
