# tk-task-list



<!-- Auto Generated Below -->


## Events

| Event            | Description | Type               |
| ---------------- | ----------- | ------------------ |
| `taskItemDrop`   |             | `CustomEvent<any>` |
| `taskItemLoaded` |             | `CustomEvent<any>` |


## Methods

### `getTaskItemData() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `reloadTaskList() => Promise<void>`



#### Returns

Type: `Promise<void>`




## Dependencies

### Used by

 - [tk-app-root](../../app/tk-app-root)

### Depends on

- [tk-task-list-item](../task-list-item)
- [tk-task-list-filter](../task-list-filter)

### Graph
```mermaid
graph TD;
  tk-task-list --> tk-task-list-item
  tk-task-list --> tk-task-list-filter
  tk-app-root --> tk-task-list
  style tk-task-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
