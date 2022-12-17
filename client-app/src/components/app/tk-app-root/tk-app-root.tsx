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

  @Listen('requestLoginAsGuest')
  async handleRequestLoginAsGuest() {
    state.user.email = '';
    this.authenticated = true;
  }

  @Listen('bulkAddDialogClosed')
  bulkAddDialogClosedHandler() {
    this.clearAllHighlight();
  }

  @Listen('targetZoneUpdated')
  async targetZoneUpdatedHandler(event) {
    let targetZone = event.detail;
    console.log(`(listener) target zone: ${targetZone}`);
    this.clearAllHighlight();
    this.highlightTargetZone(targetZone);
  }

  clearAllHighlight() {
    let itemListElement = document.querySelector('tk-task-list').shadowRoot.querySelector('.taskList');
    if(itemListElement) {
      itemListElement.classList.remove('showHighlight');
    }
    let matrixZoneList = document.querySelector('tk-matrix-grid').shadowRoot.querySelectorAll('tk-matrix-grid-zone');
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
    if(!targetZone) {
      let itemListElement = document.querySelector('tk-task-list').shadowRoot.querySelector('.taskList');
      if(itemListElement) {
        itemListElement.classList.add('showHighlight');
      }
    } else {
      let matrixZoneList = document.querySelector('tk-matrix-grid').shadowRoot.querySelectorAll('tk-matrix-grid-zone');
      let targetZoneElement = matrixZoneList[targetZone-1].shadowRoot.querySelector('.gridZone');
      if(targetZoneElement) {
        targetZoneElement.classList.add('showHighlight');
      }
    }
  }

  @Listen('addTaskItemSuccess')
  async addTaskItemSuccessHandler() {
    this.callReloadTaskList();
  }

  @Listen('taskItemUpdated')
  async taskItemUpdatedHandler(event) {
    let taskZone = event.detail.zone;
    this.updateZone(taskZone);
  }

  @Listen('taskItemDrop')
  async taskItemDropHandler(event) {
    let taskName = event.detail.name;
    let taskColor = event.detail.color;
    let taskZoneFrom = event.detail.zoneFrom;
    let taskZoneTo = event.detail.zoneTo;

    console.log(`taskItemDropHanlder called for ${taskName} of color ${taskColor} moving from ${taskZoneFrom} to ${taskZoneTo}`);

    if(taskZoneFrom === taskZoneTo) {
      console.log(`drag & drop from same place, nothing to do`);
      return;
    }

    state.taskItemList.map(taskItem => {
      if(taskItem.name === taskName) {
        taskItem.zone = taskZoneTo;
        taskItem.color = taskColor;
      }
    });

    this.updateZone(taskZoneFrom);
    this.updateZone(taskZoneTo);
  }

  updateZone(zone) {
    if(!zone) {
      this.callReloadTaskList();
    } else {
      this.callReloadMatrixGridZone(zone);
    }
  }

  async callReloadTaskList() {
    await customElements.whenDefined('tk-task-list');
    let taskListElement = document.querySelector('tk-task-list');
    taskListElement.reloadTaskList();
  }

  async callReloadMatrixGridZone(zone: number) {
    let matrixZoneList = document.querySelector('tk-matrix-grid').shadowRoot.querySelectorAll('tk-matrix-grid-zone');
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
          style={{zIndex: '3', width:'300px', fontWeight:'bold'}} id="mySidebar"><br/>
          <h3 class="w3-center" style={{padding: '5px'}}>{this.getTitle()}</h3>
          <div style={{padding:'5px'}}>
            <tk-task-list-bar></tk-task-list-bar>
            <tk-add-task-item></tk-add-task-item>
            <tk-task-list></tk-task-list>
          </div>
        </nav>

        <header class="w3-container w3-top w3-hide-large w3-xlarge w3-padding-16">
          <span class="w3-left w3-padding" style={{color:'white'}}>Time Management Matrix</span>
          <a href="javascript:void(0)" class="w3-right w3-button w3-white"
            onClick={()=>this.toggleSideMenu(!this.sideMenuOpen)}>☰</a>
        </header>

        <div class="w3-overlay w3-hide-large w3-animate-opacity" 
          onClick={()=>this.toggleSideMenu(false)}
          style={{cursor:'pointer'}} title="close side menu" id="myOverlay"></div>

        <div class="w3-main app-main" style={{marginLeft:'300px'}}> 
          <div class="w3-hide-large" style={{marginTop:'83px'}}></div>
          <div class="tk-main-container" style={{padding: '5px'}}>
            <tk-matrix-grid></tk-matrix-grid>
          </div>
        </div>

        <div class="footer">
          <p>Made with Shoelace, Stencil JS, Nest JS, Mongoose and MongoDB</p>
        </div>
      </AppLogin>
    );
  }

}
