import { http, HttpResponse } from 'msw';
import { createMockHaztrakUser } from '~/mocks/fixtures';
import {
  createMockProfileResponse,
  createMockRcrainfoProfileResponse,
  createMockServerTask,
} from '~/mocks/fixtures/mockUser';
import { AuthSuccessResponse, HaztrakUser } from '~/store/userApi/userApi';

/** mock Rest API*/
const API_BASE_URL = import.meta.env.VITE_HT_API_URL;
export const mockUserEndpoints = [
  /** GET User */
  http.get(`${API_BASE_URL}/api/auth/user/`, () => {
    return HttpResponse.json({ ...createMockHaztrakUser() }, { status: 200 });
  }),
  /** Update User */
  http.put(`${API_BASE_URL}/api/auth/user/`, (info) => {
    const user: HaztrakUser = { ...createMockHaztrakUser() };
    return HttpResponse.json({ ...user, ...info.request.body }, { status: 200 });
  }),
  /** GET Profile */
  http.get(`${API_BASE_URL}/api/my-profile`, () => {
    return HttpResponse.json({ ...createMockProfileResponse() }, { status: 200 });
  }),
  /** Login */
  http.post(`${API_BASE_URL}/api/browser/v1/auth/login/`, () => {
    const user = createMockHaztrakUser();
    const body: AuthSuccessResponse = {
      status: 200,
      data: {
        user: {
          id: user.id ? user.id : '',
          email: user.email ? user.email : '',
          username: user.username,
          display: 'foo',
          has_usable_password: true,
        },
        methods: [
          {
            method: 'password',
            at: 0,
            username: createMockHaztrakUser().username,
          },
        ],
        meta: {
          is_authenticated: true,
        },
      },
    };
    return HttpResponse.json(
      {
        ...body,
      },
      { status: 200 }
    );
  }),
  /** Logout */
  http.post(`${API_BASE_URL}/api/auth/logout/`, () => {
    return HttpResponse.json({ detail: 'Successfully logged out.' }, { status: 200 });
  }),
  /** GET RCRAInfo profile */
  http.get(`${API_BASE_URL}/api/rcrainfo-profile/:username`, (info) => {
    const { username } = info.params;
    if (typeof username !== 'string') {
      return HttpResponse.json({}, { status: 404 });
    }
    const rcrainfoProfile = createMockRcrainfoProfileResponse({ user: username });
    return HttpResponse.json(
      {
        ...rcrainfoProfile,
      },
      { status: 200 }
    );
  }),
  /** POST RCRAInfo profile Sync*/
  http.post(`${API_BASE_URL}/api/rcrainfo-profile/sync`, () => {
    const mockTask = createMockServerTask();
    return HttpResponse.json(
      {
        ...mockTask,
      },
      { status: 200 }
    );
  }),
  /** PUT RCRAInfo profile */
  http.put(`${API_BASE_URL}/api/rcrainfo-profile/:username`, (info) => {
    const { username } = info.params;
    if (typeof username !== 'string') {
      return HttpResponse.json({}, { status: 404 });
    }
    const rcrainfoProfile = createMockRcrainfoProfileResponse({
      user: username,
      ...info.request.body,
    });
    return HttpResponse.json(
      {
        ...rcrainfoProfile,
      },
      { status: 200 }
    );
  }),
];
