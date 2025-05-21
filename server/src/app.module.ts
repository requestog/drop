import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as process from 'node:process';
import { DatabaseModule } from './modules/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { ProductsModule } from './modules/products/products.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'node:path';
import { ReviewModule } from './modules/review/review.module';
import { BrandsModule } from './modules/brands/brands.module';
import { ParentProductModule } from './modules/parent-product/parent-product.module';
import { ProductSizesModule } from './modules/product-sizes/product-sizes.module';
import { CategoryModule } from './modules/category/category.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';
import { ProfileModule } from './modules/profile/profile.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    MailModule,
    ProductsModule,
    ReviewModule,
    BrandsModule,
    ParentProductModule,
    ProductSizesModule,
    CategoryModule,
    FavoritesModule,
    CartModule,
    OrderModule,
    ConfigModule,
    ProfileModule,
  ],
})
export class AppModule {}
