import { Manifest } from 'components/Manifest';
import { http, HttpResponse } from 'msw';
import { createMockManifest } from '../fixtures';

export const API_BASE_URL = import.meta.env.VITE_HT_API_URL;
const mockMTN = createMockManifest().manifestTrackingNumber;

const generateRandomMTN = (): string => {
  return Math.floor(100000000 + Math.random() * 900000000).toString();
};

export const mockManifestEndpoints = [
  /** mock GET Manifest*/
  http.get(`${API_BASE_URL}/api/rcra/manifest/${mockMTN}`, (info) => {
    return HttpResponse.json(createMockManifest(), { status: 200 });
  }),
  /** Mock create local Manifests*/
  http.post(`${API_BASE_URL}/api/rcra/manifest`, async (info) => {
    let bodyManifest = (await info.request.json()) as Manifest;
    if (!bodyManifest.manifestTrackingNumber)
      bodyManifest.manifestTrackingNumber = `${generateRandomMTN()}DFT`.padEnd(9, '0');
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
