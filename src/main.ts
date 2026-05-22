import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //Tất cả routes đều có prefix
  app.setGlobalPrefix('api/v1');

  //Tất cả requests đều phải validate
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //Loại bỏ các fields không được định nghĩa trong DTO
      forbidNonWhitelisted: true, //Không cho phép gửi các fields không được định nghĩa trong DTO
      transform: true, //Chuyển đổi các giá trị từ string sang các kiểu dữ liệu khác
      transformOptions: { enableImplicitConversion: true }, //Chuyển đổi các giá trị từ string sang các kiểu dữ liệu khác
    }),
  );

   //Kích hoạt class-transformer cho toàn app
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); // lấy Reflector instance từ DI container của NestJS,

  //Setup Swagger UI 
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Task Manager API')
      .setDescription('REST API for Task Manager')
      .setVersion('1.0')
      .addBearerAuth() // thêm nút Authorize trên Swagger UI để test API cần JWT.
      .build();
    SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config)); // Tạo document cho Swagger UI với /docs
  }

  //Cho phép tất cả origins truy cập API
  //ALLOWED_ORIGINS là một biến môi trường chứa danh sách các origins được phép truy cập API. Nếu không có, mặc định là '*' (tất cả origins).
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true, //Cho phép gửi credentials (cookies, headers, ...)
  });

  //Lấy port từ biến môi trường PORT. Nếu không có, mặc định là 3000.
  const port = process.env.PORT || 3000;
  await app.listen(port);

  //In ra thông tin app đang chạy
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Port: ${port}`);
}
bootstrap();