import { Component, Event, EventEmitter, Host, h, Prop, State } from '@stencil/core';

import state from '../../../stores/tk-app-store';

@Component({
  tag: 'tk-task-list-item',
  styleUrl: 'task-list-item.css',
  shadow: true,
})
export class TaskListItem {

  @Prop() taskItem;

  @State() editable = false;

  @Event() taskItemUpdated: EventEmitter;

  componentWillLoad() {
    
  }

  handleDragStart(event) {
    console.log(`dragging start from task-list-item`);
    event.dataTransfer.setData('taskItem', JSON.stringify(this.taskItem));
  }

  handleDragOver(event) {
    event.preventDefault();
  }

  setEditable(flag) {
    this.editable = flag;
  }

  updateTaskItem(event) {
    let text = event.target.innerHTML.trim();
    if(text !== this.taskItem.name) {
      
      console.log(`task name change detected! ${text}`);
      state.taskItemList.map(item => {
        if(item.name === this.taskItem.name) {
          item.name = text;
        }
      });
      //this.taskItem.name = text;
      this.taskItemUpdated.emit(this.taskItem);
    }
    this.setEditable(false);
  }

  render() {
    if(!this.taskItem) {
      return;
    }

    return (
      <Host>
        <div class="taskListItem" draggable={true} contentEditable={this.editable}
        onClick={()=>this.setEditable(true)} onBlur={(event)=>this.updateTaskItem(event)}
        onDragStart={(event)=>this.handleDragStart(event)}
        onDragOver={(event)=>this.handleDragOver(event)}>
          {this.taskItem.name}
        </div>
      </Host>
    );
  }

}
