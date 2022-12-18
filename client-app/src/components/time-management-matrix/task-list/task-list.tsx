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
  @Event() taskItemLoaded: EventEmitter;

  componentWillLoad() {
    this.getTaskItemData();
  }

  @Method()
  async reloadTaskList() {
    this.getTaskItemData();
  }

  getDataUrl() {
    if(state.user.email) {
      return `${state.timeManagementMatrixApi}/task-item/user/${state.user.email}`;
    }
    return `${state.timeManagementMatrixApi}/task-item/user/guest`;
  }

  async getTaskItemData() {
    // let response = await fetch(this.getDataUrl());
    // let json = await response.json();

    await fetch(this.getDataUrl())
      .then(response => response.json())
      .then(json => {
        console.log(`got ${json.length} task item back`);
        state.taskItemList = json;

        let noZoneItemList = state.taskItemList.filter(item => item.zone === 0);
        noZoneItemList = noZoneItemList.sort((a,b)=>a.name>b.name?1:-1);
        this.taskItemList = [...noZoneItemList];

        this.taskItemLoaded.emit();
      });
  }
  
  handleDragOver(event) {
    event.preventDefault();
  }
  handleDrop(event) {
    let taskItemString = event.dataTransfer.getData('taskItem');
    console.log(`dropped ${taskItemString}`);
    let taskItem = JSON.parse(taskItemString);
    
    this.taskItemDrop.emit({
      _id: taskItem._id,
      name: taskItem.name,
      color: taskItem.color,
      zoneFrom: taskItem.zone,
      zoneTo: 0
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
