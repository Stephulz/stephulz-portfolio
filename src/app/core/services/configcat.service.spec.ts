import { createConsoleLogger, getClient } from '@configcat/sdk';
import { isDevMode } from '@angular/core';
import { ConfigCatService } from './configcat.service';

jest.mock('@angular/core', () => ({
    ...jest.requireActual('@angular/core'),
    isDevMode: jest.fn(() => true),
}));

jest.mock('@configcat/sdk', () => ({
    createConsoleLogger: jest.fn(() => ({ level: 'info' })),
    getClient: jest.fn(),
    LogLevel: { Info: 1, Warn: 2 },
    PollingMode: { LazyLoad: 'LazyLoad' },
}));

describe('ConfigCatService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (isDevMode as jest.Mock).mockReturnValue(true);
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

    it('should dispose the client on ngOnDestroy', () => {
        const mockClient = {
            getValueAsync: jest.fn().mockResolvedValue(true),
            waitForReady: jest.fn().mockResolvedValue(undefined),
            snapshot: jest.fn().mockReturnValue({}),
            dispose: jest.fn(),
        };

        (getClient as jest.Mock).mockReturnValue(mockClient);

        const service = new ConfigCatService();
        service.ngOnDestroy();

        expect(mockClient.dispose).toHaveBeenCalledTimes(1);
    });

    it('uses Warn log level when not in dev mode', () => {
        (isDevMode as jest.Mock).mockReturnValue(false);

        const mockClient = {
            getValueAsync: jest.fn().mockResolvedValue(true),
            waitForReady: jest.fn().mockResolvedValue(undefined),
            snapshot: jest.fn().mockReturnValue({}),
            dispose: jest.fn(),
        };
        (getClient as jest.Mock).mockReturnValue(mockClient);

        const _service = new ConfigCatService();

        expect(createConsoleLogger).toHaveBeenCalledWith(2); // LogLevel.Warn = 2
    });

    it('should handle corrupted localStorage cache gracefully (catch block)', async () => {
        const mockClient = {
            getValueAsync: jest.fn().mockResolvedValue(true),
            waitForReady: jest.fn().mockResolvedValue(undefined),
            snapshot: jest.fn().mockReturnValue({}),
            dispose: jest.fn(),
        };

        localStorage.setItem('configcat-cache:projectSection', 'NOT_VALID_JSON');

        (getClient as jest.Mock).mockReturnValue(mockClient);

        const service = new ConfigCatService();

        // Should not throw — the catch block returns null, and getValueAsync fetches from client
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
