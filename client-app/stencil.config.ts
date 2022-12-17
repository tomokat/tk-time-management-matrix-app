import { Config } from '@stencil/core';
import dotenvPlugin from 'rollup-plugin-dotenv';

export const config: Config = {
  namespace: 'tk-time-management-matrix-components',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
    {
      type: 'www',
      copy: [
        { src: '../node_modules/@shoelace-style/shoelace/dist',
          dest: 'shoelace'
        },
        // {
        //   src: '../node_modules/chip-input/source',
        //   dest: 'chip-input'
        // }
      ]
    }
  ],
  plugins: [
    dotenvPlugin()
  ]
};
