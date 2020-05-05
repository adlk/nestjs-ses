import { Module, DynamicModule } from '@nestjs/common';
import { ConfigurationSes } from './interfaces/configuration-ses.interface';
import { SES_CONFIG } from './tokens/tokens';
import { UtilsService } from './services/utils/utils.service';
import { SesService } from './services/relay/ses.service';

@Module({})
export class SesModule {
  public static forRoot(config: ConfigurationSes) {
    return {
      module: SesModule,
      providers: [
        {
          provide: SES_CONFIG, useValue: {
            AKI_KEY: config.AKI_KEY,
            SECRET: config.SECRET,
            REGION: config.REGION
          } as ConfigurationSes
        },
        UtilsService,
        SesService,
      ],
      exports: [UtilsService, SesService],
    };
  }
}
