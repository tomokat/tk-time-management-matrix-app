import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'tk-matrix-grid',
  styleUrl: 'matrix-grid.css',
  shadow: true,
})
export class MatrixGrid {

  @Prop() worksheet;
  // @Prop() colSize = 2;

  renderMatrixGrid() {
    return (
      <div class="container">
        <tk-matrix-grid-zone zoneNumber={1}
          zoneCaption="Frist">
        </tk-matrix-grid-zone>
        <tk-matrix-grid-zone zoneNumber={2}
          zoneCaption="Second">
        </tk-matrix-grid-zone>
        <tk-matrix-grid-zone zoneNumber={3}
          zoneCaption="Third">
        </tk-matrix-grid-zone>
        <tk-matrix-grid-zone zoneNumber={4}
          zoneCaption="Fourth">
        </tk-matrix-grid-zone>
      </div>      
    );
  }

  findLegend(key) {
    return this.worksheet.legends.find(legend => legend.key === key).value;
  }

  renderMatrixLegend() {
    return (
      <div class="matrixLegend">
        <div class="horizontalAxe">
          <div class="high">{this.findLegend('horizontal-high')}</div>
          <div class="low">{this.findLegend('horizontal-low')}</div>
        </div>
        <div class="verticalAxe">
          <div class="high">{this.findLegend('vertical-high')}</div>
          <div class="low">{this.findLegend('vertical-low')}</div>
        </div>
      </div>
    );
  }
  
  render() {
    return (
      <Host>
        {this.renderMatrixLegend()}
        {this.renderMatrixGrid()}
      </Host>
    );
  }

}
