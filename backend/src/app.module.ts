import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

// Módulos
import { AuthModule } from './auth/auth.module';
import { FoundationsModule } from './foundations/foundations.module';
import { AxesModule } from './axes/axes.module';
import { IndicatorsModule } from './indicators/indicators.module';
import { ProjectsModule } from './projects/projects.module';
import { ReportsModule } from './reports/reports.module';
import { PaymentsModule } from './payments/payments.module';
import { AuditModule } from './audit/audit.module';

// Entidades
import { Foundation } from './foundations/entities/foundation.entity';
import { User } from './auth/entities/user.entity';
import { Axis } from './axes/entities/axis.entity';
import { Indicator } from './indicators/entities/indicator.entity';
import { FoundationAxis } from './foundations/entities/foundation-axis.entity';
import { Project } from './projects/entities/project.entity';
import { ProjectIndicator } from './projects/entities/project-indicator.entity';
import { Milestone } from './projects/entities/milestone.entity';
import { Report } from './reports/entities/report.entity';
import { PaymentRequest } from './payments/entities/payment-request.entity';
import { AuditLog } from './audit/entities/audit-log.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [
        Foundation,
        User,
        Axis,
        Indicator,
        FoundationAxis,
        Project,
        ProjectIndicator,
        Milestone,
        Report,
        PaymentRequest,
        AuditLog,
      ],
      synchronize: false, // Usamos migraciones manuales
      logging: process.env.NODE_ENV === 'development',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'your-secret-key-here',
      signOptions: { expiresIn: '24h' },
    }),
    AuthModule,
    FoundationsModule,
    AxesModule,
    IndicatorsModule,
    ProjectsModule,
    ReportsModule,
    PaymentsModule,
    AuditModule,
  ],
})
export class AppModule {}