import { Component, Event, EventEmitter, Host, h } from '@stencil/core';

import state from '../../../stores/tk-app-store';

@Component({
  tag: 'tk-add-worksheet',
  styleUrl: 'add-worksheet.css',
  shadow: true,
})
export class AddWorksheet {

  @Event() addWorksheetSuccess: EventEmitter;

  requestObject;

  componentWillLoad() {
    this.initialize();
  }

  initialize() {
    this.requestObject = {
      caption: '',
      legends: [
        {key:'horizontal-high', value: 'Important'},
        {key:'horizontal-low', value: 'Not Important'},
        {key:'vertical-high', value: 'Urgent'},
        {key:'vertical-low', value: 'Not Urgent'}
      ],
      user: state.user.email
    };
  }

  handleCaptionChange(key, value) {
    this.requestObject[key] = value;
  }

  handleLegendsChange(key, value) {
    this.requestObject.legends.map(legend => {
      if(legend.key === key) {
        legend.value = value;
      }
    });
  }

  async generateNewWorksheet() {
    console.log(`about to create worksheet (by calling DB)`);
    let newWorksheet = await this.createWorksheet();
    console.dir(newWorksheet);
  }

  createWorksheet() {
    console.dir(this.requestObject);
    return fetch(`${state.timeManagementMatrixApi}/worksheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.requestObject)
    })
    .then(response => response.json())
    .then(json => {
      this.addWorksheetSuccess.emit(json);
      return json;
    });
  }

  render() {
    return (
      <Host style={{padding: '10px'}}>
        <sl-input placeholder="Caption" clearable
          onBlur={(e)=>this.handleCaptionChange('caption', e.target.value)}></sl-input>
        <div style={{padding: '5px'}}>Matrix grid legend</div>
        <div class="matrixGridLegend">
          <sl-input value='Important' clearable
            onBlur={(e)=>this.handleLegendsChange('horizontal-high', e.target.value)}></sl-input>
          <sl-input value='Not Important' clearable
            onBlur={(e)=>this.handleLegendsChange('horizontal-low', e.target.value)}></sl-input>
          <sl-input value='Urgent' clearable
            onBlur={(e)=>this.handleLegendsChange('vertical-high', e.target.value)}></sl-input>
          <sl-input value='Not Urgent' clearable
            onBlur={(e)=>this.handleLegendsChange('vertical-low', e.target.value)}></sl-input>
        </div>
        <div style={{padding: '5px'}}>
          place check list here
        </div>
        <div>
          <sl-button variant="primary"
            onClick={()=>this.generateNewWorksheet()}>Generate</sl-button>
        </div>
      </Host>
    );
  }

}
