export enum Region {
    "서울특별시",
    "부산광역시",
    "대구광역시",
    "인천광역시",
    "광주광역시",
    "대전광역시",
    "울산광역시",
    "세종특별자치시",
    null,
    "경기도",
    "강원도",
    "충청북도",
    "충청남도",
    "전라북도",
    "전라남도",
    "경상북도",
    "경상남도",
    "제주특별자치도"
}
export enum Level {
    "유치원",
    "초등학교",
    "중학교",
    "고등학교",
    "특수학교"
}


export interface SchoolInfo {
    orgCode: string;
    kraOrgNm: string;
    engOrgNm: string;
    insttClsfCode: string;
    lctnScCode: string;
    lctnScNm: string;
    sigCode: string;
    juOrgCode: string;
    schulKndScCode: string;
    orgAbrvNm01: string;
    orgAbrvNm02: string;
    endYmd: string;
    orgUon: string;
    updid: string;
    mdfcDtm: string;
    atptOfcdcConctUrl: string;
    addres: string;
}