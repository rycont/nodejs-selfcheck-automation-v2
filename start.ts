import { config } from "dotenv";
import ora from "ora";
import { getSchoolID, getToken, takeSurvey, setPrivateKey } from ".";
import { Level } from "./types";

config();
if (process.env.PRIVATE_KEY) setPrivateKey(process.env.PRIVATE_KEY);
else throw new Error("Privatekey를 찾을 수 없습니다!");

const getFromEnv = <T>(key: string): T => {
  const v = process.env[key];
  if (v) return (v as unknown) as T;
  throw new Error(`❌ "${key}"를 찾을 수 없습니다`);
};

const getSchoolIDSpinner = ora("학교정보를 불러오는중...").start();
const getTokenSpinner = ora("학생정보를 불러오는중...");
const takeSurveySpinner = ora("자가진단을 수행하는중...");

let uri: string;

getSchoolID({
  region: getFromEnv("REGION"),
  level: getFromEnv("LEVEL"),
  query: getFromEnv("SCHOOL_NAME"),
})
  .catch((e) => {
    getSchoolIDSpinner.fail("학교정보를 받아오는데 실패했습니다");
    throw e;
  })
  .then((e) => {
    uri = e[0].atptOfcdcConctUrl;
    getSchoolIDSpinner.succeed(`학교명: ${e[0].kraOrgNm}`);
    getTokenSpinner.start();
    return getToken({
      name: getFromEnv("STUDENT_NAME"),
      birthday: getFromEnv("STUDENT_BIRTHDAY"),
      schoolId: e[0].orgCode,
      domain: uri,
    });
  })
  .catch((e) => {
    getTokenSpinner.fail("학생정보를 받아오는데 실패했습니다.");
    throw e;
  })
  .then((e) => {
    getTokenSpinner.succeed(
      `학생 이름: ${getFromEnv("STUDENT_NAME")}, 생년월일: ${getFromEnv(
        "STUDENT_BIRTHDAY"
      )}`
    );
    takeSurveySpinner.start();
    return takeSurvey({
      token: e,
      name: getFromEnv("STUDENT_NAME"),
      domain: uri,
    });
  })
  .catch((e) => {
    takeSurveySpinner.fail("자가진단 제출에 실패했습니다");
    throw e;
  })
  .then((e) => {
    return takeSurveySpinner.succeed(`🎉 오늘의 자가진단을 완료했습니다`);
  })
  .catch((e) => {
    console.log("\n😢 자가진단을 완료하지 못했습니다. 에러명: \n", e.message);
  });
