import { Component, Element, Event, EventEmitter, Host, h, Method, Prop, State } from '@stencil/core';

import state from '../../../stores/tk-app-store';

@Component({
  tag: 'tk-matrix-grid-zone',
  styleUrl: 'matrix-grid-zone.css',
  shadow: true,
})
export class MatrixGridZone {

  @Element() el;

  @Prop() zoneNumber : number;
  @Prop() zoneCaption;

  @State() taskItemList = [];

  @Event() taskItemDrop: EventEmitter;

  @Method()
  async reloadMatrixGridZone() {
    this.getTaskItemForZone();
  }

  componentWillLoad() {
    this.getTaskItemForZone();
  }

  getTaskItemForZone() {
    let zoneItemList = state.taskItemList.filter(item => item.zone && item.zone === this.zoneNumber);
    zoneItemList = zoneItemList.sort((a,b)=>a.name>b.name?1:-1);
    this.taskItemList = [...zoneItemList];
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
      zoneTo: this.zoneNumber
    });
  }

  renderTaskItemList() {
    return (
      this.taskItemList.map(taskItem =>
        <tk-task-list-item taskItem={taskItem}></tk-task-list-item>
      )
    )
  }

  clearAllEditWithinZone(event) {
    console.log(`clearAllEditWithinZone() get called`);

    let taskListItems = this.el.shadowRoot.querySelectorAll('tk-task-list-item');
    console.log(`found ${taskListItems.length} items within zone ${this.zoneNumber}`);
    taskListItems.forEach(taskListItem => {
      taskListItem.clearEdit();
    });
  }

  render() {
    return (
      <Host>
        <div class="gridZone"
          onClick={(event)=>this.clearAllEditWithinZone(event)}
          onDragOver={(event)=>this.handleDragOver(event)}
          onDrop={(event)=>this.handleDrop(event)}>
            {this.renderTaskItemList()}
        </div>
        {/* <div class="overlay">
          <div>{this.zoneCaption}</div>
        </div> */}
      </Host>
    );
  }

}
