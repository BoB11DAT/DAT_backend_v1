import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { JudgeModule } from "./judge/judge.module";

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UserModule,
    JudgeModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env`],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
