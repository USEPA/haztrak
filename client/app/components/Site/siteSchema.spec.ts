import { describe, expect, it } from 'vitest';
import { rcraSite } from '~/components/RcraSite';
import { siteSchema } from './siteSchema';

describe('siteSchema', () => {
  it('throws an error if name is missing', () => {
    const invalidSite = {
      handler: rcraSite,
    };
    expect(() => siteSchema.parse(invalidSite)).toThrow();
  });

  it('throws an error if handler is missing', () => {
    const invalidSite = {
      name: 'Test Site',
    };
    expect(() => siteSchema.parse(invalidSite)).toThrow();
  });

  it('throws an error if name is not a string', () => {
    const invalidSite = {
      name: 123,
      handler: rcraSite,
    };
    expect(() => siteSchema.parse(invalidSite)).toThrow();
  });

  it('throws an error if handler is not a valid rcraSite', () => {
    const invalidSite = {
      name: 'Test Site',
      handler: {},
    };
    expect(() => siteSchema.parse(invalidSite)).toThrow();
  });
});
