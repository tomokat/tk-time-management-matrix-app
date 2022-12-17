import { Component, Event, EventEmitter, Host, h, State, Method } from '@stencil/core';

import state from '../../../stores/tk-app-store';

@Component({
  tag: 'tk-task-list',
  styleUrl: 'task-list.css',
  shadow: true,
})
export class TaskList {

  @State() taskItemList;

  @Event() taskItemDrop: EventEmitter;

  componentWillLoad() {
    this.getTaskItemData();
  }

  @Method()
  async reloadTaskList() {
    let noZoneItemList = state.taskItemList.filter(item => !item.zone);
    noZoneItemList = noZoneItemList.sort((a,b)=>a.name>b.name?1:-1);
    this.taskItemList = [...noZoneItemList];
  }

  getTaskItemData() {
    state.taskItemList = [
      {name: 'first'},
      {name: 'second'},
      {name: 'third'},
      {name: 'fourth'},
      {name: 'Test', zone: 1, color: '#b21f1fff'},
      {name: 'Toast', zone: 1},
      {name: 'Apple', zone: 2},
      {name: 'Orange', zone: 2},
      {name: 'Banana', zone: 2, color: '#8b572aff'},
      {name: 'Soccer', zone: 3},
      {name: 'Tennis', zone: 3},
      {name: 'Game', zone: 4, color: '#7ed321ff'}
    ];
    let noZoneItemList = state.taskItemList.filter(item => !item.zone);
    noZoneItemList = noZoneItemList.sort((a,b)=>a.name>b.name?1:-1);
    this.taskItemList = [...noZoneItemList];
  }
  
  handleDragOver(event) {
    event.preventDefault();
  }
  handleDrop(event) {
    let taskItemString = event.dataTransfer.getData('taskItem');
    console.log(`dropped ${taskItemString}`);
    let taskItem = JSON.parse(taskItemString);
    
    this.taskItemDrop.emit({
      name: taskItem.name,
      color: taskItem.color,
      zoneFrom: taskItem.zone,
      zoneTo: undefined
    });
  }

  renderTaskItemList() {
    return (
      this.taskItemList.map(taskItem =>
        <tk-task-list-item taskItem={taskItem}></tk-task-list-item>
      )
    )
  }

  render() {
    if(!this.taskItemList) {
      return;
    }

    console.log(`tk-list render: ${JSON.stringify(this.taskItemList)}`);

    return (
      <Host>
        <div class="taskList"
          onDragOver={(event)=>this.handleDragOver(event)} 
          onDrop={(event)=>this.handleDrop(event)}>
          {this.renderTaskItemList()}
        </div>
      </Host>
    );
  }

}
