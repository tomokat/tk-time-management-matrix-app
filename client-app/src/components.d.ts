/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface TkAddTaskItem {
    }
    interface TkAppRoot {
    }
    interface TkAppSplash {
    }
    interface TkMatrixGrid {
    }
    interface TkMatrixGridZone {
        "reloadMatrixGridZone": () => Promise<void>;
        "zoneCaption": any;
        "zoneNumber": number;
    }
    interface TkTaskList {
        "reloadTaskList": () => Promise<void>;
    }
    interface TkTaskListBar {
    }
    interface TkTaskListItem {
        "taskItem": any;
    }
}
export interface TkAddTaskItemCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTkAddTaskItemElement;
}
export interface TkAppSplashCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTkAppSplashElement;
}
export interface TkMatrixGridZoneCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTkMatrixGridZoneElement;
}
export interface TkTaskListCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTkTaskListElement;
}
export interface TkTaskListBarCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTkTaskListBarElement;
}
export interface TkTaskListItemCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTkTaskListItemElement;
}
declare global {
    interface HTMLTkAddTaskItemElement extends Components.TkAddTaskItem, HTMLStencilElement {
    }
    var HTMLTkAddTaskItemElement: {
        prototype: HTMLTkAddTaskItemElement;
        new (): HTMLTkAddTaskItemElement;
    };
    interface HTMLTkAppRootElement extends Components.TkAppRoot, HTMLStencilElement {
    }
    var HTMLTkAppRootElement: {
        prototype: HTMLTkAppRootElement;
        new (): HTMLTkAppRootElement;
    };
    interface HTMLTkAppSplashElement extends Components.TkAppSplash, HTMLStencilElement {
    }
    var HTMLTkAppSplashElement: {
        prototype: HTMLTkAppSplashElement;
        new (): HTMLTkAppSplashElement;
    };
    interface HTMLTkMatrixGridElement extends Components.TkMatrixGrid, HTMLStencilElement {
    }
    var HTMLTkMatrixGridElement: {
        prototype: HTMLTkMatrixGridElement;
        new (): HTMLTkMatrixGridElement;
    };
    interface HTMLTkMatrixGridZoneElement extends Components.TkMatrixGridZone, HTMLStencilElement {
    }
    var HTMLTkMatrixGridZoneElement: {
        prototype: HTMLTkMatrixGridZoneElement;
        new (): HTMLTkMatrixGridZoneElement;
    };
    interface HTMLTkTaskListElement extends Components.TkTaskList, HTMLStencilElement {
    }
    var HTMLTkTaskListElement: {
        prototype: HTMLTkTaskListElement;
        new (): HTMLTkTaskListElement;
    };
    interface HTMLTkTaskListBarElement extends Components.TkTaskListBar, HTMLStencilElement {
    }
    var HTMLTkTaskListBarElement: {
        prototype: HTMLTkTaskListBarElement;
        new (): HTMLTkTaskListBarElement;
    };
    interface HTMLTkTaskListItemElement extends Components.TkTaskListItem, HTMLStencilElement {
    }
    var HTMLTkTaskListItemElement: {
        prototype: HTMLTkTaskListItemElement;
        new (): HTMLTkTaskListItemElement;
    };
    interface HTMLElementTagNameMap {
        "tk-add-task-item": HTMLTkAddTaskItemElement;
        "tk-app-root": HTMLTkAppRootElement;
        "tk-app-splash": HTMLTkAppSplashElement;
        "tk-matrix-grid": HTMLTkMatrixGridElement;
        "tk-matrix-grid-zone": HTMLTkMatrixGridZoneElement;
        "tk-task-list": HTMLTkTaskListElement;
        "tk-task-list-bar": HTMLTkTaskListBarElement;
        "tk-task-list-item": HTMLTkTaskListItemElement;
    }
}
declare namespace LocalJSX {
    interface TkAddTaskItem {
        "onAddTaskItemSuccess"?: (event: TkAddTaskItemCustomEvent<any>) => void;
    }
    interface TkAppRoot {
    }
    interface TkAppSplash {
        "onRequestLoginAsGuest"?: (event: TkAppSplashCustomEvent<any>) => void;
    }
    interface TkMatrixGrid {
    }
    interface TkMatrixGridZone {
        "onTaskItemDrop"?: (event: TkMatrixGridZoneCustomEvent<any>) => void;
        "zoneCaption"?: any;
        "zoneNumber"?: number;
    }
    interface TkTaskList {
        "onTaskItemDrop"?: (event: TkTaskListCustomEvent<any>) => void;
    }
    interface TkTaskListBar {
        "onBulkAddDialogClosed"?: (event: TkTaskListBarCustomEvent<any>) => void;
        "onTargetZoneUpdated"?: (event: TkTaskListBarCustomEvent<any>) => void;
        "onTaskItemUpdated"?: (event: TkTaskListBarCustomEvent<any>) => void;
    }
    interface TkTaskListItem {
        "onDeleteTaskItemSuccess"?: (event: TkTaskListItemCustomEvent<any>) => void;
        "onTaskItemUpdated"?: (event: TkTaskListItemCustomEvent<any>) => void;
        "taskItem"?: any;
    }
    interface IntrinsicElements {
        "tk-add-task-item": TkAddTaskItem;
        "tk-app-root": TkAppRoot;
        "tk-app-splash": TkAppSplash;
        "tk-matrix-grid": TkMatrixGrid;
        "tk-matrix-grid-zone": TkMatrixGridZone;
        "tk-task-list": TkTaskList;
        "tk-task-list-bar": TkTaskListBar;
        "tk-task-list-item": TkTaskListItem;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "tk-add-task-item": LocalJSX.TkAddTaskItem & JSXBase.HTMLAttributes<HTMLTkAddTaskItemElement>;
            "tk-app-root": LocalJSX.TkAppRoot & JSXBase.HTMLAttributes<HTMLTkAppRootElement>;
            "tk-app-splash": LocalJSX.TkAppSplash & JSXBase.HTMLAttributes<HTMLTkAppSplashElement>;
            "tk-matrix-grid": LocalJSX.TkMatrixGrid & JSXBase.HTMLAttributes<HTMLTkMatrixGridElement>;
            "tk-matrix-grid-zone": LocalJSX.TkMatrixGridZone & JSXBase.HTMLAttributes<HTMLTkMatrixGridZoneElement>;
            "tk-task-list": LocalJSX.TkTaskList & JSXBase.HTMLAttributes<HTMLTkTaskListElement>;
            "tk-task-list-bar": LocalJSX.TkTaskListBar & JSXBase.HTMLAttributes<HTMLTkTaskListBarElement>;
            "tk-task-list-item": LocalJSX.TkTaskListItem & JSXBase.HTMLAttributes<HTMLTkTaskListItemElement>;
        }
    }
}
