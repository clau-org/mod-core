import { Logger } from '../src/log.ts';

Deno.test('Logger should log message', () => {
	const logger = new Logger({ prefix: 'CLAU' });
	logger.debug('Hello, world!');
	logger.info('Hello, world!');
	logger.warn('Hello, world!');
	logger.error('Hello, world!');
});
