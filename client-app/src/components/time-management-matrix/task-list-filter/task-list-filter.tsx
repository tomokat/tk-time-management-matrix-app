import { Component, Event, EventEmitter, Host, h, State } from '@stencil/core';

@Component({
  tag: 'tk-task-list-filter',
  styleUrl: 'task-list-filter.css',
  shadow: true,
})
export class TaskListFilter {

  @Event() filterTypeUpdated: EventEmitter;

  @State() FilterType = 'none';

  getVariantForButton(zone) {
    if(this.FilterType === zone) {
      return 'primary';
    }
    return 'default';
  }

  updateFilterType(newZone) {
    this.FilterType = newZone;
    this.filterTypeUpdated.emit(newZone);
  }

  renderZoneGroup() {
    return (
      <sl-button-group label="Alignment">
        <sl-button variant={this.getVariantForButton('none')}
          onClick={()=>this.updateFilterType('none')}>None</sl-button>
        <sl-button variant={this.getVariantForButton('all')}
          onClick={()=>this.updateFilterType('all')}>All</sl-button>
      </sl-button-group>
    );
  }

  render() {
    return (
      <Host>
        {this.renderZoneGroup()}
      </Host>
    );
  }

}
