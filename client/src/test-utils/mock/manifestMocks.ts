import { http, HttpResponse } from 'msw';
import { createMockManifest } from '../fixtures';
import { Manifest } from 'components/Manifest';

export const API_BASE_URL = import.meta.env.VITE_HT_API_URL;
const mockMTN = createMockManifest().manifestTrackingNumber;

export const manifestMocks = [
  /** mock GET Manifest*/
  http.get(`${API_BASE_URL}/api/rcra/manifest/${mockMTN}`, (info) => {
    return HttpResponse.json(createMockManifest(), { status: 200 });
  }),
  /** Mock create local Manifests*/
  http.post(`${API_BASE_URL}/api/rcra/manifest`, async (info) => {
    let bodyManifest = (await info.request.json()) as Manifest;
    if (!bodyManifest.manifestTrackingNumber)
      bodyManifest.manifestTrackingNumber = `${Math.floor(Math.random() * 1000000000)}DFT`.padEnd(
        9,
        '0'
      );
    return HttpResponse.json(bodyManifest, { status: 200 });
  }),
  /** Mock update local Manifests*/
  http.put(`${API_BASE_URL}/api/rcra/manifest/:mtn`, async (info) => {
    const { mtn } = info.params;
    let bodyManifest = (await info.request.json()) as Manifest;
    if (bodyManifest.manifestTrackingNumber !== mtn)
      return HttpResponse.json(null, { status: 400 });
    return HttpResponse.json(bodyManifest, { status: 200 });
  }),
  /** list of manifests ('My Manifests' feature and a site's manifests)*/
  http.get(`${API_BASE_URL}/api/rcra/mtn*`, (info) => {
    const mockManifestArray = [
      createMockManifest(),
      createMockManifest({ manifestTrackingNumber: '987654321ELC', status: 'Pending' }),
    ];
    return HttpResponse.json(mockManifestArray, { status: 200 });
  }),
];
