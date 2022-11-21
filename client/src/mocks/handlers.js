import { rest } from 'msw';

const API_BASE_URL = process.env.REACT_APP_HT_API_URL;

export const handlers = [
  rest.post(`${API_BASE_URL}/api/user/login`, (req, res, ctx) => {
    // Persist user's authentication in the session
    sessionStorage.setItem('token', 'this_is_a_fake_token');
    sessionStorage.setItem('user', 'testuser1');

    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json({
        token: 'fake_token',
        user: 'testuser1',
      })
    );
  }),
  rest.get(`${API_BASE_URL}/api/user/profile`, (req, res, ctx) => {
    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json({
        token: 'fake_token',
        user: 'testuser1',
        rcraAPIID: 'test_api_id',
        rcraAPIKey: 'test_api_key_to_be_eliminated',
        epaSites: ['VATESTRAN003', 'VATESTGEN001'],
        phoneNumber: undefined,
        loading: false,
        error: undefined,
      })
    );
  }),
];
// const initialState: UserState = {
//   user: JSON.parse(localStorage.getItem('user') || 'null') || null,
//   token: JSON.parse(localStorage.getItem('token') || 'null') || null,
//   rcraAPIID: '',
//   rcraAPIKey: '',
//   epaSites: [],
//   phoneNumber: undefined,
//   loading: false,
//   error: undefined,
// };
