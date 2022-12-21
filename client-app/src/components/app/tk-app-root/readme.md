# app-root



<!-- Auto Generated Below -->


## Dependencies

### Depends on

- [tk-app-splash](../tk-app-splash)
- [tk-task-list-bar](../../time-management-matrix/task-list-bar)
- [tk-add-task-item](../../time-management-matrix/add-task-item)
- [tk-task-list](../../time-management-matrix/task-list)
- [tk-tab-matrix-grid](../../time-management-matrix/tab-matrix-grid)

### Graph
```mermaid
graph TD;
  tk-app-root --> tk-app-splash
  tk-app-root --> tk-task-list-bar
  tk-app-root --> tk-add-task-item
  tk-app-root --> tk-task-list
  tk-app-root --> tk-tab-matrix-grid
  tk-task-list --> tk-task-list-item
  tk-task-list --> tk-task-list-filter
  tk-tab-matrix-grid --> tk-matrix-grid
  tk-tab-matrix-grid --> tk-add-worksheet
  tk-matrix-grid --> tk-matrix-grid-zone
  tk-matrix-grid-zone --> tk-task-list-item
  style tk-app-root fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
