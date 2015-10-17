# Note
이 프로젝트는 프론트엔드 캠프 강의에서 사용하는 예제로서 실제 쇼핑몰로 사용하기에는 기능이 많이 빠져있습니다. 실제 쇼핑몰을 운영하는 용도로는 사용하지 마세요.

This is just a sample online shop for my class. Don't use this in production.

# Usage
1. 원하는 폴더로 이동한 후 명령줄에서 `git` 명령어를 사용해 프로젝트를 클론합니다.
   ```
   git clone https://github.com/taggon/FastShop.git
   ```
   git 클라이언트가 설치되어 있지 않다면 http://git-scm.com/ 에서 다운로드 후 설치하세요.
1. `cd FastShop` 실행하여 FastShop 폴더로 이동합니다.
1. `npm install`을 실행하여 필요한 패키지를 설치합니다.
1. `npm start`를 실행하여 서버를 실행합니다.
1. 웹 브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

# API

## 로그인
- **POST** /api/login 로그인을 수행한다.  
  파라미터
  - email : 사용자 이메일
  - password : 패스워드
   
  기본 사용자는 `user@mail.com`를 사용자 이름으로, `1234`를 패스워드로 사용하여 로그인 할 수 있다.

## 카트
- **GET** /api/cart 카트에 담겨진 상품에 대한 정보를 반환한다.
- **POST** /api/cart 장바구니에 상품을 추가한다.  
  파라미터
  - option_id : 추가할 상품의 옵션 아이디
  - quantity : 상품 갯수
- **PUT** /api/cart/OPTION_ID 장바구니에 추가된 상품의 정보를 수정한다. OPTION_ID 대신 제거할 상품의 옵션 아이디를 입력한다.  
  파라미터
  - quantity : 수정할 갯수
- **DELETE** /api/cart/OPTION_ID. OPTION_ID 대신 제거할 상품의 옵션 아이디를 입력한다.
