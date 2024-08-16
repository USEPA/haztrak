import { Manifest } from '~/components/Manifest';
import { http, HttpResponse } from 'msw';
import { createMockManifest } from '../fixtures';

export const API_BASE_URL = import.meta.env.VITE_HT_API_URL;

const generateRandomMTN = (): string => {
  return Math.floor(100000000 + Math.random() * 900000000).toString();
};

export const mockManifestEndpoints = [
  /** mock GET Manifests*/
  http.get(`${API_BASE_URL}/api/manifest`, () => {
    return HttpResponse.json(
      [
        createMockManifest({ manifestTrackingNumber: '123456789ELC' }),
        createMockManifest({ manifestTrackingNumber: '987654321ELC' }),
      ],
      {
        status: 200,
      }
    );
  }),
  /** mock GET Manifests By Site*/
  http.get(`${API_BASE_URL}/api/manifest/:siteId`, (info) => {
    const { siteId } = info.params;
    if (typeof siteId !== 'string') return HttpResponse.json(null, { status: 400 });
    return HttpResponse.json(
      [
        createMockManifest({ manifestTrackingNumber: '123456789ELC' }),
        createMockManifest({ manifestTrackingNumber: '987654321ELC' }),
      ],
      {
        status: 200,
      }
    );
  }),
  /** mock GET Manifest*/
  http.get(`${API_BASE_URL}/api/manifest/:mtn`, (info) => {
    const { mtn } = info.params;
    if (typeof mtn !== 'string') return HttpResponse.json(null, { status: 400 });
    return HttpResponse.json(createMockManifest({ manifestTrackingNumber: mtn }), { status: 200 });
  }),
  /** Mock create local Manifests*/
  http.post(`${API_BASE_URL}/api/manifest`, async (info) => {
    const bodyManifest = (await info.request.json()) as Manifest;
    if (!bodyManifest.manifestTrackingNumber)
      bodyManifest.manifestTrackingNumber = `${generateRandomMTN()}DFT`.padEnd(9, '0');
    return HttpResponse.json(bodyManifest, { status: 200 });
  }),
  /** Mock update local Manifests*/
  http.put(`${API_BASE_URL}/api/manifest/:mtn`, async (info) => {
    const { mtn } = info.params;
    const bodyManifest = (await info.request.json()) as Manifest;
    if (bodyManifest.manifestTrackingNumber !== mtn)
      return HttpResponse.json(null, { status: 400 });
    return HttpResponse.json(bodyManifest, { status: 200 });
  }),
  /** list of manifests ('My Manifests' feature and a site's manifests)*/
  http.get(`${API_BASE_URL}/api/mtn*`, () => {
    const mockManifestArray = [
      createMockManifest(),
      createMockManifest({ manifestTrackingNumber: '987654321ELC', status: 'Pending' }),
    ];
    return HttpResponse.json(mockManifestArray, { status: 200 });
  }),
];
