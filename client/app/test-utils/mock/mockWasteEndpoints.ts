import { http, HttpResponse } from 'msw';
import { mockDotIdNumbers, mockFederalWasteCodes } from '~/test-utils/fixtures/mockWaste';

/** mock Rest API*/
const API_BASE_URL = import.meta.env.VITE_HT_API_URL;
export const mockWasteEndpoints = [
  /** GET User */
  http.get(`${API_BASE_URL}/api/waste/code/federal`, () => {
    return HttpResponse.json(mockFederalWasteCodes, { status: 200 });
  }),
  http.get(`${API_BASE_URL}/api/waste/dot/id`, (info) => {
    const url = new URL(info.request.url);
    const query = url.searchParams.get('q');
    let filteredIds: string[] = [];
    if (query) {
      filteredIds = mockDotIdNumbers.filter((id) => id.includes(query));
    } else {
      filteredIds = mockDotIdNumbers;
    }
    return HttpResponse.json(filteredIds, { status: 200 });
  }),
];
