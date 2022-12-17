import { Component, Event, EventEmitter, Host, h } from '@stencil/core';

import state from '../../../stores/tk-app-store';

@Component({
  tag: 'tk-add-task-item',
  styleUrl: 'add-task-item.css',
  shadow: true,
})
export class AddTaskItem {

  @Event() addTaskItemSuccess: EventEmitter;

  addTaskItemWithEnterKey(event) {
    let newTaskItem = event.target.value;
    if(event.keyCode === 13) {
      this.addNewTaskItem({name: newTaskItem});
      event.target.value = '';
    }
  }

  addNewTaskItem(newTaskItem) {
    //TODO: make a call to REST API
    state.taskItemList.push(newTaskItem);
    
    this.addTaskItemSuccess.emit();
  }

  render() {
    return (
      <Host>
        <sl-input name="newTaskItemInput" placeholder="" size="large"
          onKeyDown={(event)=>{this.addTaskItemWithEnterKey(event)}}>  
        </sl-input>
      </Host>
    );
  }

}
