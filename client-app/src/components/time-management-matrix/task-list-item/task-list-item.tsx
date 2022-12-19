import { Component, Element, Event, EventEmitter, Host, h, Listen, Method, Prop, State, Watch } from '@stencil/core';

import state from '../../../stores/tk-app-store';

@Component({
  tag: 'tk-task-list-item',
  styleUrl: 'task-list-item.css',
  shadow: true,
})
export class TaskListItem {

  @Element() el;

  @Prop({mutable: true}) taskItem;
  @Prop() filterType;
  @Prop() placedInZone;

  @State() editable = false;
  @State() tempColor;

  @Event() taskItemUpdated: EventEmitter;
  @Event() deleteTaskItemSuccess: EventEmitter;

  @Watch('taskItem')
  taskItemChangeHanlder() {
    this.tempColor = this.taskItem.color;
  }

  @Method()
  async clearEdit() {
    if(this.editable) {
      this.updateTaskItemColor(null);
    }
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

  makeEditable(event) {
    if(!this.placedInZone) {
      return;
    }

    if(!this.editable) {
      //this.setEditable(false);
      console.log(`makeEditable() called`);
      this.editable = true;
      event.stopPropagation();
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
    if(event) {
      event.stopPropagation();
    }
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
      let targetTaskItem = state.taskItemList.find(taskItem => {
        return taskItem._id === this.taskItem._id
      });
      if(targetTaskItem) {
        targetTaskItem.name = text;
        this.taskItemUpdated.emit(this.taskItem);
      }
      // state.taskItemList.map(item => {
      //   if(item.name === this.taskItem.name) {
      //     item.name = text;
      //   }
      // });
    }
    this.setEditable(false);
  }

  clearColor(event) {
    // let targetTaskItem = state.taskItemList.find(taskItem => {
    //   return taskItem._id === this.taskItem._id
    // });
    // if(targetTaskItem) {
    //   this.tempColor = undefined;
    //   //this.taskItemUpdated.emit(this.taskItem);
    // }
    this.tempColor = '';
    event.stopPropagation();
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
          <sl-button variant="text" style={{position: 'relative', top: '5px'}}
            onClick={(event)=>this.clearColor(event)}>Clear</sl-button>
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

  renderZoneIndicator() {
    if(this.filterType === 'none' || this.placedInZone) {
      return;
    }

    return (
      <span>
        <sl-badge pill style={{position:'relative', top:'-1px', left: '-3px'}}>{this.taskItem.zone}</sl-badge>
      </span>
    );
  }

  renderAsCard() {
    return (
      <div class="taskListItem" draggable={true}
        style={this.getStyleForTaskItem()}
        onClick={(event)=>this.makeEditable(event)}
        onDragStart={(event)=>this.handleDragStart(event)}
        onDragOver={(event)=>this.handleDragOver(event)}>
        <span class="taskListItemContainer">
          {this.renderZoneIndicator()}
          {this.renderTaskItemBody()}
        </span>
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
