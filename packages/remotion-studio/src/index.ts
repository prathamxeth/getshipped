import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root';

// Register Root for Remotion CLI preview and render
registerRoot(RemotionRoot);

export * from './Root';
export * from './compositions/GetShippedMasterVideo';
export * from './scenes/CodeDiffScene';
export * from './scenes/UICursorZoomScene';
export * from './scenes/KineticCaptionsOverlay';
export * from './data';
export * from './utils/springPhysics';
export * from './utils/syntaxHighlight';
