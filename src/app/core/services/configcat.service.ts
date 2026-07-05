import { isDevMode, Injectable, type OnDestroy } from '@angular/core';
import type { IConfigCatClient } from '@configcat/sdk';
import { createConsoleLogger, LogLevel, getClient, PollingMode } from '@configcat/sdk';
import { environment } from '../../env';

@Injectable({ providedIn: 'root' })
export class ConfigCatService implements OnDestroy {
    private static readonly CACHE_TTL_MS = 60_000;
    private static readonly STORAGE_KEY = 'configcat-cache';

    public readonly client: IConfigCatClient;

    constructor() {
        // Setting log level to Info to show detailed feature flag evaluation
        const logger = createConsoleLogger(isDevMode() ? LogLevel.Info : LogLevel.Warn)

        this.client = getClient(environment.CONFIGCAT_SDK, PollingMode.LazyLoad, {
            cacheTimeToLiveSeconds: 60,
            logger
        });
    }

    ngOnDestroy(): void { this.client.dispose(); }

    async getValueAsync(feature: string, defaultValue: boolean): Promise<boolean> {
        const now = Date.now();
        const cached = this.getCachedValue(feature);

        if (cached && cached.expiresAt > now) {
            return cached.value;
        }

        const value = await this.client.getValueAsync(feature, defaultValue);
        this.setCachedValue(feature, value, now + ConfigCatService.CACHE_TTL_MS);
        return value;
    }

    private getCachedValue(feature: string): { value: boolean; expiresAt: number } | null {
        try {
            const raw = localStorage.getItem(`${ConfigCatService.STORAGE_KEY}:${feature}`);
            if (!raw) {
                return null;
            }

            const parsed = JSON.parse(raw) as { value: boolean; expiresAt: number };
            return parsed;
        } catch {
            return null;
        }
    }

    private setCachedValue(feature: string, value: boolean, expiresAt: number): void {
        try {
            localStorage.setItem(`${ConfigCatService.STORAGE_KEY}:${feature}`, JSON.stringify({ value, expiresAt }));
        } catch {
            // Ignore localStorage write failures (private mode, disabled storage, etc.)
        }
    }
}