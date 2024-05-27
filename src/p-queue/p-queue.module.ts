import { FactoryProvider, Module, ModuleMetadata, Provider } from '@nestjs/common';
import PQueue from 'p-queue';

export type RegisterOptions = ConstructorParameters<typeof PQueue>[0];
export type RegisterAsyncOptions = Pick<FactoryProvider<RegisterOptions>, 'useFactory' | 'inject'> &
  Pick<ModuleMetadata, 'imports'>;

@Module({})
export class PQueueModule {
  static registerAsync(options: RegisterAsyncOptions) {
    const provider: Provider = {
      ...options,
      provide: PQueue,
      useFactory: async (...args: Parameters<typeof options.useFactory>) => {
        const config = await options.useFactory(...args);
        return new PQueue(config);
      },
    };

    return {
      module: PQueueModule,
      imports: options.imports,
      providers: [provider],
      exports: [provider],
    };
  }
}
