import { filterVoivodeships, POLISH_VOIVODESHIPS } from './VoivodeshipSelect';

describe('Polish voivodeship selector', () => {
  it('contains 16 unique canonical values', () => {
    expect(POLISH_VOIVODESHIPS).toHaveLength(16);
    expect(new Set(POLISH_VOIVODESHIPS).size).toBe(16);
    expect(POLISH_VOIVODESHIPS.every(value => value === value.trim())).toBe(true);
    expect(POLISH_VOIVODESHIPS.every(value => value === value.toLocaleLowerCase('pl')))
      .toBe(true);
  });

  it('filters values without requiring Polish diacritics', () => {
    expect(filterVoivodeships('lodz')).toEqual(['łódzkie']);
    expect(filterVoivodeships('maz')).toContain('mazowieckie');
  });
});
