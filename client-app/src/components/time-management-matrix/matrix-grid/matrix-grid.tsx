import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'tk-matrix-grid',
  styleUrl: 'matrix-grid.css',
  shadow: true,
})
export class MatrixGrid {

  // @Prop() row = 2;
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
  
  render() {
    return (
      <Host>
        {this.renderMatrixGrid()}
      </Host>
    );
  }

}
