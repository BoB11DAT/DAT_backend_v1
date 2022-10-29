import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ApplyingJudgeEntity, ApplyingAnswerEntity } from "./applying.entity";

@Injectable()
export class ApplyingService {
  constructor(
    @InjectRepository(ApplyingJudgeEntity)
    private readonly applyingJudgeRepository: Repository<ApplyingJudgeEntity>,
    @InjectRepository(ApplyingAnswerEntity)
    private readonly applyingAnswerRepository: Repository<ApplyingAnswerEntity>,
    private jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}
  getHello(): string {
    return "Hello World!";
  }

  findAll(user_uuid: string): Promise<ApplyingJudgeEntity[]> {
    return this.applyingJudgeRepository.find({ where: { user_uuid } });
  } //이거 카테고리별로 문제 번호 나눠서 반환하고 클라이언트에서 카테고리별로 문제 번호 나눠서 표시해야함
  //그냥 foreach로 카테고리랑 문제도 같이 넣어서 반환. 아니지 join으로 judge_id기준으로 찾아서 같이 반환하면 됨

  findAllAnswer(user_uuid: string): Promise<ApplyingAnswerEntity[]> {
    return this.applyingAnswerRepository.find({ where: { user_uuid } });
  }

  getUUIDFromReq(req: any): string {
    return this.jwtService.verify(req.headers.authorization.split(" ")[1], {
      secret: this.config.get("ACCESS_TOKEN_SECRET"),
    }).user_uuid;
  }
}
/* 구현할 때 우선 시험 응시 시작하면 문제 랜덤으로 뽑아오고 뽑아온 만큼 applying_answers에
칼럼을 만들어서 applying_judge의 id를 등록해주고 문제 전체를 불러온다.
문제 전체랑 답을 불러올 때 applying_judge 불러오면 applying_judge의 id들도 같이 불러와서
클라이언트에 저장해놓고 applying_answer불러올 때 칼럼의 applying_judge_id 기준으로
정답을 로드시킨다. 또 applying_answer_id도 저장한다.
정답 업데이트할 때 user_uuid랑 receipt_registration_number랑 applying_answer_id 기준으로
업데이트한다. 옛날 정답 바꾸는 걸 막기 위해 receipt_registration_number로
시험 종료됐는지 체크하고 바꾼다. 이렇게 하면 applying_answers에 judge_number가 필요없다.*/
