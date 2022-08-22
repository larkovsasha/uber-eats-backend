import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { JwtModuleOptionsInterface } from './jwt-module-options.interface';
import { CONFIG_OPTIONS } from '../common/common.constants';

@Module({
  providers: [JwtService],
})
@Global()
export class JwtModule {
  static forRoot(options: JwtModuleOptionsInterface): DynamicModule {
    return {
      module: JwtModule,
      exports: [JwtService],
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        JwtService,
      ],
    };
  }
}
