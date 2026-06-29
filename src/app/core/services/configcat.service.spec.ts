import { getClient } from '@configcat/sdk';
import { ConfigCatService } from './configcat.service';

jest.mock('@configcat/sdk', () => ({
    createConsoleLogger: jest.fn(() => ({ level: 'info' })),
    getClient: jest.fn(),
    LogLevel: { Info: 1, Warn: 2 },
    PollingMode: { LazyLoad: 'LazyLoad' },
}));

describe('ConfigCatService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    it('returns the evaluated feature flag value from the ConfigCat client', async () => {
        const mockClient = {
            getValueAsync: jest.fn().mockResolvedValue(true),
            waitForReady: jest.fn().mockResolvedValue(undefined),
            snapshot: jest.fn().mockReturnValue({}),
            dispose: jest.fn(),
        };

        (getClient as jest.Mock).mockReturnValue(mockClient);

        const service = new ConfigCatService();

        await expect(service.getValueAsync('projectSection', false)).resolves.toBe(true);
        expect(mockClient.getValueAsync).toHaveBeenCalledWith('projectSection', false);
    });

    it('reuses cached values for 60 seconds before requesting again', async () => {
        const mockClient = {
            getValueAsync: jest.fn().mockResolvedValue(true),
            waitForReady: jest.fn().mockResolvedValue(undefined),
            snapshot: jest.fn().mockReturnValue({}),
            dispose: jest.fn(),
        };
        let now = 0;

        jest.spyOn(Date, 'now').mockImplementation(() => now);
        (getClient as jest.Mock).mockReturnValue(mockClient);

        const service = new ConfigCatService();

        await expect(service.getValueAsync('projectSection', false)).resolves.toBe(true);
        await expect(service.getValueAsync('projectSection', false)).resolves.toBe(true);

        expect(mockClient.getValueAsync).toHaveBeenCalledTimes(1);

        now = 60001;

        await expect(service.getValueAsync('projectSection', false)).resolves.toBe(true);
        expect(mockClient.getValueAsync).toHaveBeenCalledTimes(2);
    });
});
