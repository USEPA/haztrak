import { rest } from 'msw';
import { MOCK_EPA_ID, MOCK_MANIFEST, MOCK_MTN } from '../fixtures';
import { MOCK_SITE_ARRAY, MOCK_SITE_OBJECT, MOCK_USERNAME } from '../fixtures/mockHandler';
import { MOCK_MANIFESTS_ARRAY } from '../fixtures/mockManifest';

export const API_BASE_URL = process.env.REACT_APP_HT_API_URL;

export const handlers = [
  rest.post(`${API_BASE_URL}/api/user/login`, (req, res, ctx) => {
    // Persist user's authentication in the session
    sessionStorage.setItem('token', 'this_is_a_fake_token');
    sessionStorage.setItem('user', MOCK_USERNAME);

    // Mock response from haztrak API
    return res(
      ctx.status(200),
      ctx.json({
        token: 'fake_token',
        user: MOCK_USERNAME,
      })
    );
  }),
  rest.get(`${API_BASE_URL}/api/trak/profile/${MOCK_USERNAME}`, (req, res, ctx) => {
    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json({
        token: 'fake_token',
        user: MOCK_USERNAME,
        rcraAPIID: 'mockRCRAInfoAPIId',
        rcraUsername: 'dpgraham4401',
        epaSites: ['VATESTRAN003', 'VATESTGEN001'],
        phoneNumber: undefined,
        loading: false,
        error: undefined,
      })
    );
  }),
  rest.get(`${API_BASE_URL}/api/trak/site`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(MOCK_SITE_ARRAY));
  }),
  rest.get(`${API_BASE_URL}/api/trak/site/${MOCK_EPA_ID}`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(MOCK_SITE_OBJECT));
  }),
  rest.get(`${API_BASE_URL}/api/trak/site/${MOCK_EPA_ID}/manifest`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        generator: MOCK_MANIFESTS_ARRAY.map((mtn) => mtn.manifestTrackingNumber),
        transporter: [],
        tsd: [],
      })
    );
  }),
  rest.get(`${API_BASE_URL}/api/trak/manifest/${MOCK_MTN}`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(MOCK_MANIFEST));
  }),
];
