import { SlInput } from '@shoelace-style/shoelace';
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
    this.taskItem.color = this.tempColor;

    state.taskItemList.map(taskItem => {
      if(taskItem.name === this.taskItem.name) {
        taskItem.color = this.taskItem.color
      }
    });

    this.setEditable(false);
    event.stopPropagation();
  }

  preventEventBubble(event) {
    event.stopPropagation();
  }

  updateTaskItem(event) {
    let text = event.target.value.trim();
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

  getStyleForTaskItem() {
    if(!this.taskItem.color) {
      return {};
    }
    return {backgroundColor: this.tempColor}
  }

  renderTaskItemBody() {
    if(this.editable) {
      return (
        <div onClick={(event)=>{this.updateTaskItemColor(event)}}>
          <sl-input value={this.taskItem.name}
            onClick={(event)=>this.preventEventBubble(event)}
            onBlur={(event)=>this.updateTaskItem(event)}>
          </sl-input>
          <sl-color-picker value={this.tempColor} label="Select a color"
            onClick={(event)=>this.preventEventBubble(event)}></sl-color-picker>
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
