import { SlAlert, SlTab } from '@shoelace-style/shoelace';
import { Component, Element, Event, EventEmitter, Host, h, Listen, State } from '@stencil/core';

import state from '../../../stores/tk-app-store';

@Component({
  tag: 'tk-tab-matrix-grid',
  styleUrl: 'tab-matrix-grid.css',
  shadow: true,
})
export class TabMatrixGrid {

  @Element() el;

  @Event() currentWorksheetUpdated: EventEmitter;

  @State() customWorksheetList;

  baseWorksheet;

  @Listen('addWorksheetSuccess')
  async addWorksheetSuccessHandler(event) {
    await this.loadCustomWorksheetFromDB();
    console.log(`addWorksheetSuccess received ${event.detail._id}`);
    let alert = this.el.shadowRoot.querySelector('sl-alert') as SlAlert;
    alert.show();   

    // let targetTabElement = this.findTabElementById(event.detail._id);
    // if(targetTabElement) {
    //   targetTabElement.click();
    // }
  }

  @Listen('sl-tab-show')
  handleSlTabShow(event) {
    console.log(`tab[${event.detail.name}] got focus now`);
    state.currentWorksheet = event.detail.name;
    this.currentWorksheetUpdated.emit();
  }

  findTabElementById(id) {
    //document.querySelector('tk-tab-matrix-grid').shadowRoot.querySelector('sl-tab[panel="63a217461da95fb18b84dbd1"]')
    let tabElement = document.querySelector('tk-tab-matrix-grid');
    if(tabElement) {
      let targetTabElement = tabElement.shadowRoot.querySelector(`sl-tab[panel="${id}"]`) as SlTab;
      return targetTabElement;
    }
  }

  componentWillLoad() {
    this.initializeBaseWorksheet();
    this.loadCustomWorksheetFromDB();
  }

  initializeBaseWorksheet() {
    this.baseWorksheet = {
      caption: 'Base',
      legends: [
        {key: 'horizontal-high', value: 'Urgent'},
        {key: 'horizontal-low', value: 'Not Urgent'},
        {key: 'vertical-high', value: 'Important'},
        {key: 'vertical-low', value: 'Not Important'}
      ]
    }
  }

  getDataUrl() {
    if(state.user.email) {
      return `${state.timeManagementMatrixApi}/worksheet/user/${state.user.email}`;
    }
    return `${state.timeManagementMatrixApi}/worksheet/user/guest`;
  }

  async loadCustomWorksheetFromDB() {
    await fetch(this.getDataUrl())
      .then(response => response.json())
      .then(json => {
        state.worksheetList = json;
        this.customWorksheetList = json;
        //this.updateListFromState();
      });
  }

  renderCustomWorksheetTab() {
    if(!this.customWorksheetList) {
      return;
    }

    return (
      this.customWorksheetList.map(worksheet =>
        <sl-tab slot="nav" panel={worksheet._id} closable>{worksheet.caption}</sl-tab>
      )
    )
  }

  renderCustomWorksheetTabPanel() {
    if(!this.customWorksheetList) {
      return;
    }

    return (
      this.customWorksheetList.map(worksheet =>
        <sl-tab-panel name={worksheet._id}>
          <tk-matrix-grid worksheet={worksheet}></tk-matrix-grid>
        </sl-tab-panel>
      )
    )
  }

  

  render() {
    if(!this.customWorksheetList) {
      return;
    }

    return (
      <Host>
        <sl-tab-group>
          <sl-alert variant="primary" duration="3000">
            <sl-icon slot="icon" name="check2-circle"></sl-icon>
            Successfully created new worksheet!
          </sl-alert>

          <sl-tab slot="nav" panel="Base">Base</sl-tab>
          {this.renderCustomWorksheetTab()}
          <sl-tab slot="nav" panel="addNewTab">
            <sl-button variant="primary" size="small">New</sl-button>
          </sl-tab>

          <sl-tab-panel name="Base">
            <tk-matrix-grid worksheet={this.baseWorksheet}></tk-matrix-grid>
          </sl-tab-panel>
          {this.renderCustomWorksheetTabPanel()}
          <sl-tab-panel name="addNewTab">
            <tk-add-worksheet></tk-add-worksheet>
          </sl-tab-panel>
          
        </sl-tab-group>
      </Host>
    );
  }

}
