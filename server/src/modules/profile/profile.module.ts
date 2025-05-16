import { forwardRef, Module } from '@nestjs/common';
import { ProfileController } from './controllers/profile.controller';
import { ProfileService } from './services/profile.service';
import { UsersModule } from '../users/users.module';
import { FilesModule } from '../files/files.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [UsersModule, FilesModule, forwardRef(() => AuthModule)],
})
export class ProfileModule {}
