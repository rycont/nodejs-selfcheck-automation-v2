import { JSEncrypt } from "nodejs-jsencrypt";
import fetch from "node-fetch";
import { Level, Region, SchoolInfo } from "./types";

const encryptor = new JSEncrypt();

export const setPrivateKey = (privateKey: string) => {
  encryptor.setPrivateKey(privateKey);
};

export const getSchoolID = async ({
  region,
  level,
  query,
}: {
  region: keyof typeof Region;
  level: keyof typeof Level;
  query: string;
}): Promise<SchoolInfo[]> => {
  if (!Level[level]) throw new Error("지역정보가 올바르지 않습니다");
  if (!Region[region]) throw new Error("교급정보가 올바르지 않습니다");
  return fetch(
    `https://hcs.eduro.go.kr/v2/searchSchool?lctnScCode=${
      Region[region] + 1
    }&schulCrseScCode=${Level[level] + 1}&orgName=${encodeURI(
      query
    )}&loginType=school`
  )
    .then((e) => e.json())
    .then((e) => {
      if (e.schulList.length === 0)
        throw new Error("해당하는 학교를 찾을 수 없습니다.");
      return e.schulList;
    })
    .catch((e) => {
      throw e || new Error("학교 정보를 받아올 수 없습니다");
    });
};

export const getToken = async ({
  name,
  birthday,
  schoolId,
  domain,
}: {
  name: string;
  birthday: string;
  schoolId: string;
  domain: string;
}): Promise<string> => {
  const encryptedInfo = {
    birthday: encryptor.encrypt(birthday),
    name: encryptor.encrypt(name),
  };
  if (!domain) throw new Error("학교 정보가 올바르지 않습니다");
  return fetch(`https://${domain}/v2/findUser`, {
    method: "POST",
    body: JSON.stringify({
      ...encryptedInfo,
      orgCode: schoolId,
      loginType: "school",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((e) => e.json())
    .then((e) => {
      if (e.isError) throw new Error(e.message);
      return e.token;
    })
    .catch((e) => {
      throw e || new Error("유저 정보 찾기 실패");
    });
};

export const takeSurvey = async ({
  token,
  name,
  domain,
}: {
  token: string;
  name: string;
  domain: string;
}): Promise<{ registerDtm: string; inveYmd: string; state?: "succeed" }> => {
  if (!domain) throw new Error("학교 정보가 올바르지 않습니다");
  return fetch(`https://${domain}/registerServey`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      rspns01: "1",
      rspns02: "1",
      rspns03: null,
      rspns04: null,
      rspns05: null,
      rspns06: null,
      rspns07: "0",
      rspns08: "0",
      rspns09: "0",
      rspns10: null,
      rspns11: null,
      rspns12: null,
      rspns13: null,
      rspns14: null,
      rspns15: null,
      rspns00: "Y",
      deviceUuid: "",
      upperUserNameEncpt: name,
    }),
  })
    .then((e) => e.json())
    .then((e) => {
      if (!e.registerDtm) throw new Error("자가진단을 시행할 수 없습니다");
      return {
        ...e,
        state: "succeed",
      };
    });
};
