import { Component, h, Listen, State } from '@stencil/core';
import { SlDialog, SlInput } from '@shoelace-style/shoelace';

//import { version } from '../../../../package.json';
//import { version as backendVersion } from '../../../../../package.json';

import hotkeys from 'hotkeys-js';

import { AppLogin } from '../../../functional/app-login-functional';
import state from '../../../stores/tk-app-store';

@Component({
  tag: 'tk-app-root',
  styleUrl: 'tk-app-root.css',
  shadow: false,
})
export class AppRoot {

  @State() sideMenuOpen = false;
  @State() authenticated;

  componentDidLoad() {
    this.checkAuth();
    this.adjustCSSVariables();
    this.reflectTheme();
  }

  async checkAuth() {
    await fetch(`/auth/validate`, {
      method: 'POST',
      credentials: 'include'
    }).then(async res => {
      let result = await res.json();
      if(result.email) {
        state.user.email = result.email;
        this.authenticated = true;
      } else {
        this.authenticated = false;
      }
    }).catch(error => {
      console.log(`auth check failed with ${JSON.stringify(error)}`);
      this.authenticated = false;
    });
  }

  @Listen('themeChanged')
  themeChangedHandler() {
    this.reflectTheme();
  }

  setCSSVariable(key, value) {
    document.documentElement.style.setProperty(key, value);
  }

  reflectTheme() {
    if(state.theme === 'sun') {
      this.setCSSVariable('--task-list-background-color', 'white');
      this.setCSSVariable('--task-list-item-border-color', 'black');
      this.setCSSVariable('--task-list-item-font-color', 'black');
      this.setCSSVariable('--matrix-grid-zone-background-color', 'white');
    } else {
      this.setCSSVariable('--task-list-background-color', '#333');
      this.setCSSVariable('--task-list-item-border-color', 'white');
      this.setCSSVariable('--task-list-item-font-color', 'white');
      this.setCSSVariable('--matrix-grid-zone-background-color', '#333');
    }
  }

  @Listen('resize', {target: 'window'}) 
  windowResizeHandler () {
    this.adjustCSSVariables();
  }

  adjustCSSVariables() {
    document.documentElement.style.setProperty('--tab-matrix-height', '75px');
    document.documentElement.style.setProperty('--footer-height', '50px');
    if(window.innerWidth > 992) {
      document.documentElement.style.setProperty('--sidemenu-width', '300px');
      document.documentElement.style.setProperty('--header-height', '0px');
    } else {
      document.documentElement.style.setProperty('--sidemenu-width', '0px');
      document.documentElement.style.setProperty('--header-height', '50px');
    }
  }

  @Listen('requestLoginAsGuest')
  async handleRequestLoginAsGuest() {
    state.user.email = '';
    this.authenticated = true;
  }

  @Listen('bulkAddDialogClosed')
  bulkAddDialogClosedHandler() {
    this.clearAllHighlight();
  }

  @Listen('deleteTaskItemSuccess')
  async deleteTaskItemSuccessHandler(event) {
    let taskZone = event.detail.zone;
    this.updateZone(taskZone);
  }

  @Listen('targetZoneUpdated')
  async targetZoneUpdatedHandler(event) {
    let targetZone = event.detail;
    console.log(`(listener) target zone: ${targetZone}`);
    this.clearAllHighlight();
    this.highlightTargetZone(targetZone);
  }

  getMatrixZoneListElement() {
    let tabMatrixGridElement = document.querySelector('tk-tab-matrix-grid') as HTMLElement;
    if(!tabMatrixGridElement) {
      return;
    }
    let tabMatrixGridShadowRoot = tabMatrixGridElement.shadowRoot;
    let matrixGridElement = tabMatrixGridShadowRoot.querySelector('sl-tab-panel[active] tk-matrix-grid');
    if(!matrixGridElement) {
      return;
    }
    return matrixGridElement.shadowRoot.querySelectorAll('tk-matrix-grid-zone');
  }

  clearAllHighlight() {
    let itemListElement = document.querySelector('tk-task-list').shadowRoot.querySelector('.taskList');
    if(itemListElement) {
      itemListElement.classList.remove('showHighlight');
    }
    let matrixZoneList = this.getMatrixZoneListElement();
    for(let i = 0; i < matrixZoneList.length; i++) {
      let matrixZoneElement = matrixZoneList[i];
      if(matrixZoneElement) {
        let targetZoneElement = matrixZoneElement.shadowRoot.querySelector('.gridZone');
        if(targetZoneElement) {
          targetZoneElement.classList.remove('showHighlight');
        }
      }
    }
  }

  highlightTargetZone(targetZone) {
    if(targetZone === 0 || !targetZone) {
      let itemListElement = document.querySelector('tk-task-list').shadowRoot.querySelector('.taskList');
      if(itemListElement) {
        itemListElement.classList.add('showHighlight');
      }
    } else {
      let matrixZoneList = this.getMatrixZoneListElement();
      let targetZoneElement = matrixZoneList[targetZone-1].shadowRoot.querySelector('.gridZone');
      if(targetZoneElement) {
        targetZoneElement.classList.add('showHighlight');
      }
    }
  }

  @Listen('taskItemLoaded')
  async taskItemLoadedHandler() {
    let matrixZoneList = this.getMatrixZoneListElement();
    if(!matrixZoneList) {
      return;
    }
    for(let zoneIndex = 0; zoneIndex < matrixZoneList.length; zoneIndex++) {
      this.callReloadMatrixGridZone(zoneIndex+1);
    }
  }

  @Listen('addTaskItemSuccess')
  async addTaskItemSuccessHandler() {
    this.callGetTaskItemData();
  }

  @Listen('currentWorksheetUpdated')
  async currentWorksheetUpdatedHandler() {
    this.callGetTaskItemData();
  }

  @Listen('taskItemUpdated')
  async taskItemUpdatedHandler(event) {
    let taskZone = event.detail.zone;
    await this.updateTaskItemDBInstance(event.detail);
    this.updateZone(taskZone);
  }

  @Listen('taskItemDrop')
  async taskItemDropHandler(event) {
    let taskId = event.detail._id;
    let taskName = event.detail.name;
    let taskColor = event.detail.color;
    let taskZoneFrom = event.detail.zoneFrom;
    let taskZoneTo = event.detail.zoneTo;

    console.log(`taskItemDropHanlder called for [${taskId}] ${taskName} of color ${taskColor} moving from ${taskZoneFrom} to ${taskZoneTo}`);

    if(taskZoneFrom === taskZoneTo) {
      console.log(`drag & drop from same place, nothing to do`);
      return;
    }

    //update one instance
    console.dir(state.taskItemList);
    let targetTaskItem = state.taskItemList.find(taskItem => {
      return taskItem._id === taskId
    });

    console.dir(targetTaskItem);

    if(targetTaskItem) {
      targetTaskItem.zone = taskZoneTo;
      targetTaskItem.color = taskColor;
      this.updateZone(taskZoneFrom);
      this.updateZone(taskZoneTo);
      this.updateTaskItemDBInstance(targetTaskItem);
    }
  }

  async updateTaskItemDBInstance(taskItemData) {
    await fetch(`${state.timeManagementMatrixApi}/task-item/${taskItemData._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskItemData)
    }).then(()=> {
      // do something here
    });
  }

  updateZone(zone) {
    if(zone === 0) {
      this.callReloadTaskList();
    } else {
      this.callReloadMatrixGridZone(zone);
    }
  }

  async callGetTaskItemData() {
    await customElements.whenDefined('tk-task-list');
    let taskListElement = document.querySelector('tk-task-list');
    taskListElement.getTaskItemData();
  }

  async callReloadTaskList() {
    await customElements.whenDefined('tk-task-list');
    let taskListElement = document.querySelector('tk-task-list');
    taskListElement.reloadTaskList();
  }

  async callReloadMatrixGridZone(zone: number) {
    let matrixZoneList = this.getMatrixZoneListElement();
    matrixZoneList[zone-1].reloadMatrixGridZone();
  }

  componentWillRender() {
    this.initializeHotKeys();
  }

  shouldTrigger(event) {
    let target = event.target as Element;
    let tagName = target.tagName;
    return tagName === 'BODY';
  }

  initializeHotKeys() {
    hotkeys('shift+/', event => {
      if(this.shouldTrigger(event)) {
        console.log(`help dialog requested`);
        this.toggleHelpModal(true);
      }
    });

    hotkeys('b, s, l', (event, handler) => {
      if(this.shouldTrigger(event)) {
        console.log(`set focus on bookmark search requested`);
        if(handler.key === 'b' || handler.key === 's') {
          this.setFocusOn('.bookmarkListFilter');
        } else if(handler.key === 'l') {
          this.setFocusOn('.labelListFilter');
        }
        event.preventDefault();
      }
    });
  }

  setFocusOn(targetClassName) {
    const input = document.querySelector(targetClassName) as SlInput;
    if(input) {
      input.focus();
    }
  }

  toggleHelpModal(open: boolean) {
    const dialog = document.querySelector('.help-dialog') as SlDialog;
    if(open) {
      dialog.show();
    } else {
      dialog.hide();
    }
  }

  renderHelpDialog() {
    return (
      <sl-dialog label="Help" class="help-dialog">
        <sl-badge>?</sl-badge> = open help dialog<br/>
        <sl-badge>b, s</sl-badge> = set focus on boomkark filter<br/>
        <sl-badge>l</sl-badge> = set focus on label filter<br/>
        <sl-divider></sl-divider>
        {/* <div>Component version: {version} </div> */}
        {/* <div>Backend version: {backendVersion} </div> */}
      </sl-dialog>
    );
  }

  toggleSideMenu(show) {
    this.sideMenuOpen = show;

    let sideMenu = document.querySelector('.w3-sidebar') as HTMLElement;
    let overlay = document.querySelector('.w3-overlay') as HTMLElement;
    if(show) {
      sideMenu.style.display = 'block';
      overlay.style.display = 'block';
    } else {
      sideMenu.style.display = 'none';
      overlay.style.display = 'none';
    }
  }

  isMobileView() {
    let headerElement = document.querySelector('header') as HTMLElement;
    if(!headerElement) {
      return false;
    }
    return headerElement.style.display !== 'none';
  }

  getTitle() {
    if(this.isMobileView()) {
      return 'Manage tasks';
    }
    return 'Time Management Matrix';
  }

  render() {
    if(typeof this.authenticated === 'undefined') {
      return;
    }

    if(!this.authenticated) {
      return (
        <tk-app-splash></tk-app-splash>
      );
    }

    return (
      <AppLogin condition={this.authenticated}>
        {this.renderHelpDialog()}

        {/* Sidebar/menu */}
        <nav class="w3-sidebar w3-bar-block w3-white w3-animate-left w3-text-grey w3-collapse w3-top"
          style={{zIndex: '3', fontWeight:'bold'}} id="mySidebar">
          <h3 class="w3-center">{this.getTitle()}</h3>
          <div style={{padding:'5px'}}>
            <tk-task-list-bar></tk-task-list-bar>
            <tk-add-task-item></tk-add-task-item>
            <tk-task-list></tk-task-list>
          </div>
        </nav>

        <header class="w3-container w3-top w3-hide-large w3-xlarge w3-padding-4">
          <span class="w3-left w3-padding" style={{color:'white'}}>Time Management Matrix</span>
          <a href="javascript:void(0)" class="w3-right w3-button w3-white"
            onClick={()=>this.toggleSideMenu(!this.sideMenuOpen)}>☰</a>
        </header>

        <div class="w3-overlay w3-hide-large w3-animate-opacity" 
          onClick={()=>this.toggleSideMenu(false)}
          style={{cursor:'pointer'}} title="close side menu" id="myOverlay"></div>

        <div class="w3-main app-main" style={{marginLeft:'300px'}}> 
          <div class="w3-hide-large" style={{marginTop:'52px'}}></div>
          <div class="tk-main-container">
            <tk-tab-matrix-grid></tk-tab-matrix-grid>
          </div>
        </div>

        <div class="footer">
          <p>Made with Shoelace, Stencil JS, Nest JS, Mongoose and MongoDB (v0.7.0)</p>
        </div>
      </AppLogin>
    );
  }

}
