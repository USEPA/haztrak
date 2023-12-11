import { AxiosResponse } from 'axios';
import { QuickerSignature } from 'components/Manifest/QuickerSign';
import { TaskStatus } from 'store';
import { htApi } from './htApi';

export const manifestApi = {
  /** Sign a manifest through the Haztrak Proxy endpoint */
  createQuickSignature: async (
    signature: QuickerSignature
  ): Promise<AxiosResponse<{ taskId: string }>> => {
    return await htApi.post('rcra/manifest/sign', signature);
  },

  /** Sync a sites manifest data with RCRAInfo */
  syncManifest: async (siteId: string): Promise<AxiosResponse<TaskStatus>> => {
    return htApi.post('rcra/manifest/sync', { siteId: siteId });
  },
};
