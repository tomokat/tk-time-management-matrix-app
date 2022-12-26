# tk-tab-matrix-grid



<!-- Auto Generated Below -->


## Events

| Event                     | Description | Type               |
| ------------------------- | ----------- | ------------------ |
| `closeWorksheetRequested` |             | `CustomEvent<any>` |
| `currentWorksheetUpdated` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [tk-app-root](../../app/tk-app-root)

### Depends on

- [tk-matrix-grid](../matrix-grid)
- [tk-add-worksheet](../add-worksheet)

### Graph
```mermaid
graph TD;
  tk-tab-matrix-grid --> tk-matrix-grid
  tk-tab-matrix-grid --> tk-add-worksheet
  tk-matrix-grid --> tk-matrix-grid-zone
  tk-matrix-grid-zone --> tk-task-list-item
  tk-app-root --> tk-tab-matrix-grid
  style tk-tab-matrix-grid fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
