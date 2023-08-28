// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/matchers';
import matchers from '@testing-library/jest-dom/matchers';

import { expect } from 'vitest';

expect.extend(matchers);
