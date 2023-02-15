# CroissantGL
CroissantGL is a WebGL2 rendering library, which enables the user to set up complex 2D/3D scenes in your favourite web browser.

# API
Public-facing API documentation.

## Top-level API
Root API to access core functionalities

### `bootstrap(canvas: HTMLCanvasElement): void`
Bootstraps renderer to provided canvas and starts the renderer.
#### Arguments
| Name    | Type  | Description                             | Default value |
|---------|-------|-----------------------------------------| --- |
| canvas  | `HTMLCanvasElement` | Canvas to bootstrap renderer context to | `n/a` |

### `stop(): void`
Stops renderer. The renderer context is not cleared, only rendering to canvas to suspended.

### `start(): void`
Restarts rendering to canvas.

### `ready(): boolean`
Returns `boolean` indicating whether or not is rendering context ready.

### `on(eventType: EventType, callback: () => void): void`
Adds event listener that fires on renderer event
#### Arguments
| Name       | Type                  | Description                | Default value |
|------------|-----------------------|----------------------------| --- |
| eventType  | [`EventType`](#Types) | Type of event to listen to | `n/a` |
| callback   | `() => void`          | Callback to be called when event occurs | `n/a` |

## Debug API
Debug API used to obtain information about current application state

### `debug.info(): DebugInfo`
Returns information about current state of application (see [`DebugInfo`](#Types)) 

## Scene API
API to enable/disable helper scene methods, or other scene-related configurations.

### `scene.showAxes(showXZ: boolean, showXY: boolean, showYZ: boolean)`
Enables/disables individual axis planes
#### Arguments
| Name    | Type                  | Description                                          | Default value |
|---------|-----------------------|------------------------------------------------------| --- |
| showXZ  | `boolean` | Value indicating if `x-z` axis plane should be shown | `n/a` |
| showXY  | `boolean` | Value indicating if `x-y` axis plane should be shown | `n/a` |
| showYZ  | `boolean` | Value indicating if `y-` axis plane should be shown  | `n/a` |

## Camera API
API for manipulating camera properties.

### `camera.translate(translation: vec3): void`
Changes camera translation by provided value 
#### Arguments
| Name         | Type   | Description        | Default value |
|--------------|--------|--------------------| --- |
| translation  | `vec3` | Translation change | `n/a` |

### `camera.setTranslation(translation: vec3): void`
Sets camera translation to provided value
#### Arguments
| Name         | Type   | Description            | Default value |
|--------------|--------|------------------------| --- |
| translation  | `vec3` | New camera translation | `n/a` |

### `camera.rotate(rotation: vec3): void`
Changes camera rotation by provided value
#### Arguments
| Name      | Type   | Description     | Default value |
|-----------|--------|-----------------| --- |
| rotation  | `vec3` | Rotation change | `n/a` |

### `camera.setRotation(rotation: vec3): void`
Sets camera rotation to provided value
#### Arguments
| Name      | Type   | Description            | Default value |
|-----------|--------|------------------------| --- |
| rotation  | `vec3` | New camera rotation | `n/a` |

### `camera.info(): CameraInfo`
Returns information about current state of camera (see [`CameraInfo`](#Types))

### `camera.setMode(mode: 'perspective' | 'orthographic'): void`
Changes camera mode to perspective or orthographic
#### Arguments
| Name | Type                         | Description   | Default value   |
|------|------------------------------|---------------|-----------------|
| mode | `perspective / orthographic` | New camera mode | `n/a` |

### `camera.setClipPlanes(near: number, far: number): void`
Sets camera near/far clip planes, used for both perspective and orthographic projections
#### Arguments
| Name  | Type     | Description                     | Default value |
|-------|----------|---------------------------------| --- |
| near  | `number` | Near clip plane value           | `n/a` |
| far   | `number` | Far clip plane value            | `n/a` |

### `camera.setPerspectiveFieldOfView(angleInDegrees: number): void`
Changes field of view of perspective camera to provided value in degrees
#### Arguments
| Name  | Type     | Description                        | Default value |
|-------|----------|------------------------------------| --- |
| angleInDegrees   | `number` | New field of view angle in degrees | `n/a` |

### `camera.focalPoint.translate(translation: vec3): void`
Changes camera's focal point translation by provided value
#### Arguments
| Name         | Type   | Description        | Default value |
|--------------|--------|--------------------| --- |
| translation  | `vec3` | Translation change | `n/a` |

### `camera.focalPoint.setTranslation(translation: vec3): void`
Sets camera's focal point translation to provided value
#### Arguments
| Name         | Type   | Description                 | Default value |
|--------------|--------|-----------------------------| --- |
| translation  | `vec3` | New focal point translation | `n/a` |

## Object API
API for creating and manipulating objects

TBD

## Types
### `EventType`
```ts
type EventType = "object-created"
```

### `vec3`
```ts
type vec3 = [ x: number, y: number, z: number ];
```

### `DebugInfo`
```ts
interface DebugInfo {
    
    // Number of entities in scene
    entities: number;
    
    // Number of performed render passes
    renderPasses: number;
    
}
```

### `CameraInfo`
```ts
interface CameraInfo {
    
    // Camera's translation
    translation: vec3;
    
    // Camera's rotation in degrees
    rotation: vec3;
    
    // Camera's near clip plane
    clipNear: number;
    
    // Camera's far clip plane
    clipFar: number;
    
    // Camera's field of view angle
    angle: number;
    
    // Camera's focal point position
    focalPoint: vec3;
    
}
```