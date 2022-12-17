import { SlDialog, SlTextarea } from '@shoelace-style/shoelace';
import { Component, Host, h, Element, Event, EventEmitter, Listen, State } from '@stencil/core';

import state from '../../../stores/tk-app-store';

@Component({
  tag: 'tk-task-list-bar',
  styleUrl: 'task-list-bar.css',
  shadow: true,
})
export class TaskListBar {

  @Element() el;

  @Event() taskItemUpdated: EventEmitter;
  @Event() targetZoneUpdated: EventEmitter;
  @Event() bulkAddDialogClosed: EventEmitter;

  @State() targetZone;
  @State() bulkAddData;

  @Listen('sl-hide')
  handleSlHide(event) {
    if(event.path[0].tagName.toLowerCase() === 'sl-dialog') {
      console.log(`sl-hide get caught`);
      this.bulkAddDialogClosed.emit(this.targetZone);
    }
  }

  @Listen('sl-show')
  handleSlShow() {
    //this.targetZoneUpdated.emit(this.targetZone);
  }

  toggleBulkAddModal(open: boolean) {
    const dialog = this.el.shadowRoot.querySelector('.bulk-add-dialog') as SlDialog;
    if(open) {
      this.targetZoneUpdated.emit(this.targetZone);
      dialog.show();
    } else {
      this.bulkAddDialogClosed.emit(this.targetZone);
      dialog.hide();
    }
  }
  
  shouldDisableButton() {
    return !this.bulkAddData || !this.bulkAddData.trim();
  }

  bulkAddTaskItem() {
    if(!this.bulkAddData) {
      return;
    }
    let taskItemList = this.bulkAddData.split('\n');
    console.log(`about to create data for: ${JSON.stringify(taskItemList)}`);

    taskItemList.map(item => {
      state.taskItemList.push({
        name: item,
        zone: this.targetZone
      });
    });

    this.taskItemUpdated.emit({
      zone: this.targetZone
    });

    const textArea = this.el.shadowRoot.querySelector('sl-textarea') as SlTextarea;
    textArea.value = '';
    this.bulkAddData = '';
  }

  updateBulkAddData(event) {
    this.bulkAddData = event.target.value;
    console.log(`bulk data: ${this.bulkAddData}`);
  }

  getVariantForButton(zone) {
    if(this.targetZone === zone) {
      return 'primary';
    }
    return 'default';
  }

  updateTargetZone(newZone) {
    this.targetZone = newZone;
    this.targetZoneUpdated.emit(newZone);
  }

  renderZoneGroup() {
    return (
      <sl-button-group label="Alignment">
        <sl-button variant={this.getVariantForButton(undefined)}
          onClick={()=>this.updateTargetZone(undefined)}>None</sl-button>
        <sl-button variant={this.getVariantForButton(1)}
          onClick={()=>this.updateTargetZone(1)}>1</sl-button>
        <sl-button variant={this.getVariantForButton(2)}
          onClick={()=>this.updateTargetZone(2)}>2</sl-button>
        <sl-button variant={this.getVariantForButton(3)}
          onClick={()=>this.updateTargetZone(3)}>3</sl-button>
        <sl-button variant={this.getVariantForButton(4)}
          onClick={()=>this.updateTargetZone(4)}>4</sl-button>
      </sl-button-group>
    );
  }

  renderActionBar() {
    return (
      <div slot="footer">
        <sl-button variant="primary"
          disabled={this.shouldDisableButton()}
          onClick={()=>this.bulkAddTaskItem()}>Bulk Add</sl-button>
        <sl-button variant="text"
          onClick={()=>this.toggleBulkAddModal(false)}>Cancel</sl-button>
      </div>
    );
  }

  renderBunkAddDialog() {
    return (
      <sl-dialog label="Bunk Add" class="bulk-add-dialog">
        Zone: {this.renderZoneGroup()}
        <sl-textarea resize="auto"
          onBlur={(event)=>this.updateBulkAddData(event)}></sl-textarea>
        {this.renderActionBar()}
      </sl-dialog>
    );
  }

  renderTaskListBar() {
    return (
      <sl-tooltip content="Bulk add" style={{fontSize:'32px'}} >
        <sl-icon-button name="folder-plus" label="Bulk Add"
          onClick={()=>this.toggleBulkAddModal(true)}></sl-icon-button>
      </sl-tooltip>
    );
  }

  render() {
    return (
      <Host>
        {this.renderBunkAddDialog()}
        {this.renderTaskListBar()}
      </Host>
    );
  }

}
