import { LaunchPackPropsSchema, type LaunchPackProps } from '@getshipped/shared-types';
import rawMockLaunchPack from './mockLaunchPack.json';

/**
 * Validated launch pack props meeting the strict LaunchPackPropsSchema.
 * Throws at import time if the mock data does not conform to the schema.
 */
export const mockLaunchPack: LaunchPackProps = LaunchPackPropsSchema.parse(rawMockLaunchPack);

export default mockLaunchPack;
