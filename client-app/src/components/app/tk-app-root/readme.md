# app-root



<!-- Auto Generated Below -->


## Dependencies

### Depends on

- [tk-app-splash](../tk-app-splash)
- [tk-task-list-bar](../../time-management-matrix/task-list-bar)
- [tk-add-task-item](../../time-management-matrix/add-task-item)
- [tk-task-list](../../time-management-matrix/task-list)
- [tk-matrix-grid](../../time-management-matrix/matrix-grid)

### Graph
```mermaid
graph TD;
  tk-app-root --> tk-app-splash
  tk-app-root --> tk-task-list-bar
  tk-app-root --> tk-add-task-item
  tk-app-root --> tk-task-list
  tk-app-root --> tk-matrix-grid
  tk-task-list --> tk-task-list-item
  tk-matrix-grid --> tk-matrix-grid-zone
  tk-matrix-grid-zone --> tk-task-list-item
  style tk-app-root fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
