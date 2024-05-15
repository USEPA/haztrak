import { http, HttpResponse } from 'msw';
import { HaztrakUser } from 'store/authSlice/auth.slice';
import { LoginResponse } from 'store/userSlice/user.slice';
import { createMockHaztrakUser } from 'test-utils/fixtures';
import {
  createMockProfileResponse,
  createMockRcrainfoProfileResponse,
} from 'test-utils/fixtures/mockUser';

/** mock Rest API*/
const API_BASE_URL = import.meta.env.VITE_HT_API_URL;
export const mockUserEndpoints = [
  /** GET User */
  http.get(`${API_BASE_URL}/api/user`, () => {
    return HttpResponse.json({ ...createMockHaztrakUser() }, { status: 200 });
  }),
  /** Update User */
  http.put(`${API_BASE_URL}/api/user`, (info) => {
    const user: HaztrakUser = { ...createMockHaztrakUser() };
    return HttpResponse.json({ ...user, ...info.request.body }, { status: 200 });
  }),
  /** GET Profile */
  http.get(`${API_BASE_URL}/api/user/profile`, () => {
    return HttpResponse.json({ ...createMockProfileResponse() }, { status: 200 });
  }),
  /** Login */
  http.post(`${API_BASE_URL}/api/user/login`, (info) => {
    const body: LoginResponse = { key: 'mockToken' };
    return HttpResponse.json(
      {
        ...body,
      },
      { status: 200 }
    );
  }),
  /** GET RCRAInfo profile */
  http.get(`${API_BASE_URL}/api/user/rcrainfo-profile/:username`, (info) => {
    const { username } = info.params;
    // @ts-ignore
    const rcrainfoProfile = createMockRcrainfoProfileResponse({ user: username ?? '' });
    return HttpResponse.json(
      {
        ...rcrainfoProfile,
      },
      { status: 200 }
    );
  }),
];
