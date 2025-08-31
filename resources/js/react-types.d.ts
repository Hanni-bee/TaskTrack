// React type declarations for Laravel environment
declare module 'react' {
  export = React;
  export as namespace React;

  namespace React {
    type ReactNode = any;
    type ReactElement = any;
    type ComponentType<P = {}> = any;
    type FC<P = {}> = (props: P) => ReactElement | null;
    type Component<P = {}, S = {}> = any;

    interface HTMLAttributes<T> {
      [key: string]: any;
    }

    interface SVGAttributes<T> {
      [key: string]: any;
    }

    // Event types
    interface SyntheticEvent<T = Element, E = Event> {
      currentTarget: T;
      target: EventTarget & T;
      preventDefault(): void;
      stopPropagation(): void;
      [key: string]: any;
    }

    interface MouseEvent<T = Element> extends SyntheticEvent<T, NativeMouseEvent> {
      button: number;
      buttons: number;
      clientX: number;
      clientY: number;
      [key: string]: any;
    }

    interface TouchEvent<T = Element> extends SyntheticEvent<T, NativeTouchEvent> {
      touches: TouchList;
      changedTouches: TouchList;
      [key: string]: any;
    }

    interface KeyboardEvent<T = Element> extends SyntheticEvent<T, NativeKeyboardEvent> {
      key: string;
      keyCode: number;
      ctrlKey: boolean;
      shiftKey: boolean;
      altKey: boolean;
      metaKey: boolean;
      [key: string]: any;
    }

    interface FormEvent<T = Element> extends SyntheticEvent<T> {
      [key: string]: any;
    }

    interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
      target: EventTarget & T;
      [key: string]: any;
    }

    interface DragEvent<T = Element> extends MouseEvent<T> {
      dataTransfer: DataTransfer;
      [key: string]: any;
    }

    // Hook types
    function useState<S>(initialState: S | (() => S)): [S, (value: S | ((prev: S) => S)) => void];
    function useEffect(effect: () => void | (() => void), deps?: any[]): void;
    function useRef<T>(initialValue: T): { current: T };
    function useMemo<T>(factory: () => T, deps: any[]): T;
    function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;

    // JSX
    namespace JSX {
      interface IntrinsicElements {
        [elemName: string]: any;
      }
      interface Element extends ReactElement<any, any> {}
      interface ElementClass extends Component<any, any> {}
    }
  }

  // Default export
  const React: typeof React;
  export default React;
}

// Global React namespace
declare global {
  const React: typeof import('react');
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Navigator vibrate API
interface Navigator {
  vibrate?(pattern: number | number[]): boolean;
}

// Notification API extensions
interface NotificationOptions {
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
}
