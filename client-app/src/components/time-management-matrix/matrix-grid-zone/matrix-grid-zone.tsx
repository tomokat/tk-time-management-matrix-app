import { Component, Event, EventEmitter, Host, h, Method, Prop, State } from '@stencil/core';

import state from '../../../stores/tk-app-store';

@Component({
  tag: 'tk-matrix-grid-zone',
  styleUrl: 'matrix-grid-zone.css',
  shadow: true,
})
export class MatrixGridZone {

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

  handleDragStart(event) {
    console.log(`dragging start from matrix-grid-zone`);
    let taskItemElement = event.target.shadowRoot.querySelector('.taskListItem');
    if(!taskItemElement) {
      return;
    }
    let taskName = taskItemElement.innerHTML;
    event.dataTransfer.setData('taskItem', JSON.stringify({
      name: taskName,
      zone: this.zoneNumber
    }));
    event.stopPropagation();
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

  render() {
    return (
      <Host>
        <div class="gridZone"
          onDragStart={(event)=>this.handleDragStart(event)}
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
