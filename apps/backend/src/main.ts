import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle("Calorie Counter Backend API")
    .setDescription("API for Calorie Counter")
    .setVersion("1.0")
    .addTag("calorie-counter")
    .addCookieAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api", app, documentFactory);

  app.enableCors({
    origin: "http://localhost:5173",
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
