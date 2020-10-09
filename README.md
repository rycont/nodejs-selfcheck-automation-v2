# Selfcheck Reveerse-engineering
리뉴얼된 자가진단 프론트엔드를 분석하여 nodejs 프로그램으로 재해석했습니다.

# 사용 방법
## 설치
```bash
git clone https://github.com/rycont/nodejs-selfcheck-automation-v2
cd ./nodejs-selfcheck-automation-v2
# yarn
yarn
# npm
npm install
```
## 자가진단 정보 입력
`.env`파일을 만드시고, `.env.example`에 따라서 적당하게 정보를 채워넣어주세요. 올바르지 않은 정보가 입력되었을시에는 프로그램이 종료될 수 있습니다.

## 실행
```bash
# yarn
yarn run test
# npm
npm run test
```
![자가진단이 실행된 모습](./docs/image/demo.png)

# Contributors
[RyCont](https://github.com/rycont)
