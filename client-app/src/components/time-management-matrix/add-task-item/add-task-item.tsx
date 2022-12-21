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
    //state.taskItemList.push(newTaskItem);
    let requestData = {
      name: newTaskItem.name,
      worksheet: state.currentWorksheet,
      zone: 0,
      user: state.user.email
    };

    state.taskItemList.push(requestData);

    fetch(`${state.timeManagementMatrixApi}/task-item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    }).then((res)=> {
      console.log(`Successfully added label! ${JSON.stringify(res.json())}`);
      //event.target.parentElement.value = '';
      this.addTaskItemSuccess.emit();
    });
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
