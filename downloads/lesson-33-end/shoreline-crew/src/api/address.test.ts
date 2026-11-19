import { addressAdvice, addressProblem, hostOf } from '@/api/address';

describe('addressProblem', () => {
  it('accepts an address written correctly', () => {
    expect(addressProblem('http://192.168.1.42:4000')).toBeNull();
  });

  it('explains a missing address, a missing http:// and an /api at the end', () => {
    expect(addressProblem('')).toMatch(/is not set/);
    expect(addressProblem('192.168.1.42:4000')).toMatch(/start it with http:\/\//);
    expect(addressProblem('http://localhost:4000/api')).toMatch(/leave out the \/api/);
  });
});

describe('addressAdvice', () => {
  it('reads the host from an address', () => {
    expect(hostOf('http://LOCALHOST:4000')).toBe('localhost');
    expect(hostOf('http://[::1]:4000')).toBe('[::1]');
  });

  it('tells a phone that localhost is the phone itself', () => {
    expect(addressAdvice('http://localhost:4000', 'ios')).toMatch(/localhost is the phone itself/);
    expect(addressAdvice('http://localhost:4000', 'android')).toMatch(/10\.0\.2\.2 on the emulator/);
  });

  it('gives each device its own advice for the same address', () => {
    const address = 'http://10.0.2.2:4000';
    expect(addressAdvice(address, 'android')).toMatch(/works on the emulator, not on a phone/);
    expect(addressAdvice(address, 'ios')).toMatch(/only inside the Android emulator/);
    expect(addressAdvice(address, 'web')).toMatch(/the web preview uses localhost/);
  });
});
