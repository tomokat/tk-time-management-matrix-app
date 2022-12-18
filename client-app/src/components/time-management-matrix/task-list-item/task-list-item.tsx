import { Component, Element, Event, EventEmitter, Host, h, Listen, Prop, State, Watch } from '@stencil/core';

import state from '../../../stores/tk-app-store';

@Component({
  tag: 'tk-task-list-item',
  styleUrl: 'task-list-item.css',
  shadow: true,
})
export class TaskListItem {

  @Element() el;

  @Prop({mutable: true}) taskItem;

  @State() editable = false;
  @State() tempColor;

  @Event() taskItemUpdated: EventEmitter;
  @Event() deleteTaskItemSuccess: EventEmitter;

  @Watch('taskItem')
  taskItemChangeHanlder() {
    this.tempColor = this.taskItem.color;
  }

  @Listen('sl-change')
  slChangeHandler(event) {
    if(event.path[0].tagName.toLowerCase() === 'sl-color-picker') {
      //this.taskItem.color = event.path[0].value;
      this.tempColor = event.path[0].value;
      //this.taskItem = {...this.taskItem};
    }
  }

  componentWillLoad() {
    this.tempColor = this.taskItem.color;
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

  makeEditable() {
    if(!this.editable) {
      //this.setEditable(false);
      console.log(`makeEditable() called`);
      this.editable = true;
    }
  }

  updateTaskItemColor(event) {
    console.log(`updateTaskItemColor() get called`);

    if(this.tempColor !== this.taskItem.color) {
      console.log(`task color change detected ${this.tempColor}`);
     
      this.taskItem.color = this.tempColor;

      state.taskItemList.map(taskItem => {
        if(taskItem.name === this.taskItem.name) {
          taskItem.color = this.taskItem.color
        }
      });

      this.taskItemUpdated.emit(this.taskItem);
    }

    this.setEditable(false);
    event.stopPropagation();
  }

  preventEventBubble(event) {
    event.stopPropagation();
  }

  updateTaskItemWithEnterKey(event) {
    let text = event.target.value;
    if(event.keyCode === 13) {
      this.updateTaskItem(text);
    }
  }

  updateTaskItemWithBlur(event) {
    let text = event.target.value.trim();
    this.updateTaskItem(text);
  }

  updateTaskItem(text) {
    if(text !== this.taskItem.name) {
      
      console.log(`task name change detected! ${text}`);
      state.taskItemList.map(item => {
        if(item.name === this.taskItem.name) {
          item.name = text;
        }
      });
      
      this.taskItemUpdated.emit(this.taskItem);
    }
    this.setEditable(false);
  }

  async deleteTaskItem() {
    await fetch(`${state.timeManagementMatrixApi}/task-item/${this.taskItem._id}`, {
      method: 'DELETE'
    }).then(() => {
      state.taskItemList = state.taskItemList.filter(item => item._id !== this.taskItem._id);
      this.deleteTaskItemSuccess.emit(this.taskItem);
    });
  }

  getStyleForTaskItem() {
    if(!this.taskItem.color) {
      return {};
    }
    return {backgroundColor: this.tempColor}
  }

  renderTaskItemBody() {
    if(this.editable) {
      return (
        <div class="editableTaskItem"
          onClick={(event)=>{this.updateTaskItemColor(event)}}>
          <sl-input value={this.taskItem.name}
            onClick={(event)=>this.preventEventBubble(event)}
            onKeyPress={(event)=>this.updateTaskItemWithEnterKey(event)}
            onBlur={(event)=>this.updateTaskItemWithBlur(event)}>
          </sl-input>
          <sl-color-picker value={this.tempColor} label="Select a color"
            onClick={(event)=>this.preventEventBubble(event)}></sl-color-picker>
          <sl-button variant="danger" style={{position: 'relative', top: '5px', left: '10px'}}
            onClick={()=>this.deleteTaskItem()}>
            Delete
          </sl-button>
        </div>    
      )
    } else {
      return (
        this.taskItem.name
      )
    }
  }

  renderAsCard() {
    return (
      <div class="taskListItem" draggable={true}
        style={this.getStyleForTaskItem()}
        onClick={()=>this.makeEditable()}
        onDragStart={(event)=>this.handleDragStart(event)}
        onDragOver={(event)=>this.handleDragOver(event)}>
        {this.renderTaskItemBody()}
      </div>
    );
  }

  render() {
    if(!this.taskItem) {
      return;
    }

    return (
      <Host>
        {this.renderAsCard()}
      </Host>
    );
  }

}
