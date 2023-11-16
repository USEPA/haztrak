import { AxiosResponse } from 'axios';
import { Manifest } from 'components/Manifest';
import { QuickerSignature } from 'components/Manifest/QuickerSign';
import { htApi } from 'services/htApi';
import { TaskStatus } from 'store/task.slice';

export const manifestApi = {
  /** Sign a manifest through the Haztrak Proxy endpoint */
  createQuickSignature: async (
    signature: QuickerSignature
  ): Promise<AxiosResponse<{ taskId: string }>> => {
    return await htApi.post('rcra/manifest/sign', signature);
  },

  /** Create a manifest either via a proxy endpoint to RCRAInfo or as draft */
  createManifest: async (data: Manifest): Promise<AxiosResponse<TaskStatus | Manifest>> => {
    return await htApi.post<TaskStatus | Manifest>('/rcra/manifest', data);
  },

  /** Sync a sites manifest data with RCRAInfo */
  syncManifest: async (siteId: string): Promise<AxiosResponse<TaskStatus>> => {
    return htApi.post('rcra/manifest/sync', { siteId: siteId });
  },
};
