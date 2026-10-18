import { Config } from '@remotion/cli/config';
import fs from 'fs';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer('angle');
Config.setPixelFormat('yuv420p');
Config.setConcurrency(4);
Config.setCodec('h264');

// Auto-detect installed Google Chrome on macOS to bypass sandboxed headless-shell limitations
const macChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
if (fs.existsSync(macChrome)) {
  Config.setBrowserExecutable(macChrome);
}
