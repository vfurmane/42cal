import { DynamicModule, FactoryProvider, Module, ModuleMetadata, Provider } from '@nestjs/common';
import { ClientCredentials, ModuleOptions } from 'simple-oauth2';

export type RegisterOptions = ModuleOptions;
export type RegisterAsyncOptions = Pick<FactoryProvider<RegisterOptions>, 'useFactory' | 'inject'> &
  Pick<ModuleMetadata, 'imports'>;

export const SIMPLE_CLIENT_CREDENTIALS_PROVIDER = 'SIMPLE_CLIENT_CREDENTIALS';

@Module({})
export class SimpleClientCredentialsModule {
  static registerAsync(options: RegisterAsyncOptions): DynamicModule {
    const provider: Provider = {
      ...options,
      provide: SIMPLE_CLIENT_CREDENTIALS_PROVIDER,
      useFactory: async (...args: Array<unknown>) => {
        const config = await options.useFactory(...args);
        return new ClientCredentials(config);
      },
    };

    return {
      module: SimpleClientCredentialsModule,
      imports: options.imports,
      providers: [provider],
      exports: [provider],
    };
  }
}
