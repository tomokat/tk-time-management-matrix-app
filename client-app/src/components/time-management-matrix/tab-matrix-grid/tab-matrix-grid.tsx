import { SlAlert, SlTab, SlTabGroup } from '@shoelace-style/shoelace';
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
  @Event() closeWorksheetRequested: EventEmitter;

  @State() isWorksheetManagerVisible: boolean;
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

  @Listen('sl-close')
  handleSlClose(event) {
    if(event.path[0].tagName.toLowerCase() === 'sl-tab') {
      let targetPanel = event.path[0].panel;
      console.log(`attempt to close ${targetPanel}`);
      let targetWorksheet;
      this.customWorksheetList.map(worksheet => {
        if(worksheet._id === targetPanel) {
          worksheet.isOpen = false;
          targetWorksheet = worksheet;
        }
      });
      console.dir(targetWorksheet);
      this.removeActiveTabAndPaenl(targetPanel);
      this.customWorksheetList = [...this.customWorksheetList];
      // if(targetWorksheet) {
      //   this.closeWorksheetRequested.emit({
      //     _id: targetPanel,
      //     isOpen: false
      //   });
      // }
      event.preventDefault();
      event.stopPropagation();
    }
  }

  removeActiveTabAndPaenl(targetPanel) {
    const tab = this.findTabElementById(targetPanel);
    const tabPanel = this.findTabPanelById(targetPanel);

    if(tab.active) {
      const tabGroupElement = this.el.shadowRoot.querySelector('sl-tab-group') as SlTabGroup;
      if(tabGroupElement) {
        tabGroupElement.show('Base');
      }
    }

    tab.remove();
    tabPanel.remove();
  }

  findTabElementById(id) {
    //document.querySelector('tk-tab-matrix-grid').shadowRoot.querySelector('sl-tab[panel="63a217461da95fb18b84dbd1"]')
    const tabElement = document.querySelector('tk-tab-matrix-grid');
    if(tabElement) {
      const targetTabElement = tabElement.shadowRoot.querySelector(`sl-tab[panel="${id}"]`) as SlTab;
      return targetTabElement;
    }
  }

  findTabPanelById(id) {
    const tabElement = document.querySelector('tk-tab-matrix-grid');
    if(tabElement) {
      const targetTabPanelElement = tabElement.shadowRoot.querySelector(`sl-tab-panel[name="${id}"]`) as SlTab;
      return targetTabPanelElement;
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
        worksheet.isOpen
          ? <sl-tab slot="nav" panel={worksheet._id}>{worksheet.caption}</sl-tab>
          : ''
      )
    )
  }

  renderCustomWorksheetTabPanel() {
    if(!this.customWorksheetList) {
      return;
    }

    return (
      this.customWorksheetList.map(worksheet =>
        worksheet.isOpen
          ? <sl-tab-panel name={worksheet._id}>
             <tk-matrix-grid worksheet={worksheet}></tk-matrix-grid>
            </sl-tab-panel>
          : ''
      )
    )
  }

  toggleIsWorksheetManagerVisible() {
    this.isWorksheetManagerVisible = !this.isWorksheetManagerVisible;
  }

  setWorksheetIsOpen(worksheet, flag) {
    worksheet.isOpen = flag;
    this.customWorksheetList = [...this.customWorksheetList];
  }

  renderWorksheetManagerTab() {
    if(!this.customWorksheetList) {
      return;
    }

    return (
      this.customWorksheetList.map(worksheet =>
        <div class="worksheetManagerRow">
          <span style={{fontSize: '20px'}}>
            {worksheet.isOpen
              ? <sl-tooltip content="Opened">
                  <sl-icon-button name="door-open" label="Opened"
                    onClick={()=>this.setWorksheetIsOpen(worksheet, false)}></sl-icon-button>
                </sl-tooltip>
              : <sl-tooltip content="Closed">
                  <sl-icon-button name="door-closed" label="Closed"
                    onClick={()=>this.setWorksheetIsOpen(worksheet, true)}></sl-icon-button>
                </sl-tooltip>
            }
          </span>
          <span>{worksheet.caption}</span>
          <sl-button variant="danger">Delete</sl-button>
        </div>
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
          <sl-tab  slot="nav" panel="worksheetManagerTab">
            <sl-icon-button name="gear" label="Settings"
              onClick={()=>this.toggleIsWorksheetManagerVisible()}></sl-icon-button>
          </sl-tab>

          <sl-tab-panel name="Base">
            <tk-matrix-grid worksheet={this.baseWorksheet}></tk-matrix-grid>
          </sl-tab-panel>
          {this.renderCustomWorksheetTabPanel()}
          <sl-tab-panel name="addNewTab">
            <tk-add-worksheet></tk-add-worksheet>
          </sl-tab-panel>
          <sl-tab-panel name="worksheetManagerTab">
            {this.renderWorksheetManagerTab()}
          </sl-tab-panel>
        </sl-tab-group>
      </Host>
    );
  }

}
