import { reportError, setReporter } from './reportError';

it('turns anything thrown into an Error and survives a broken reporter', () => {
  const reporter = jest.fn();
  setReporter(reporter);
  reportError('offline', 'sync');
  expect(reporter).toHaveBeenCalledWith(new Error('offline'), 'sync');

  setReporter(() => {
    throw new Error('reporter is down');
  });
  expect(() => reportError(new Error('boom'), 'screen')).not.toThrow();
});
