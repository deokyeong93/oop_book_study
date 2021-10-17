# Chapter 12. 다형성

> 오브젝트 : 코드로 이해하는 객체지향 설계 &nbsp; / &nbsp; 조영호 저자 &nbsp; / &nbsp; 위키북스
>
> - 구입처 &nbsp; : &nbsp; [yes24](http://www.yes24.com/Product/Goods/74219491)

    &nbsp; / &nbsp;[교보문고](http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9791158391409&orderClick=LAG&Kc=)

> - 저작권을 존중하고자 노력합니다. (문제시 private 하겠습니다. )
> - 책의 내용과 다릅니다.

## reference

- [저자 조영호 님 github](https://github.com/eternity-oop/object)

※ 이번 장의 내용은 상속 이외에도 포함 다형성을 구현할 수 있는 다양한 방법에 공통적으로 적용할 수 있는 개념이다.

## 목표

- 상속의 관점에서 다형성이 구현되는 기술적인 메커니즘을 살펴보자
  **상속의 목적**
  🔴 NOT : 코드의 재사용
  🟢 RIGTH : **다형성을 위한 서브타입 계층을 구축하는 것이다.**
  - 타입 계층은 OOP의 중요한 특성중 하나인 다형성을 기반으로 제공한다.
  - 클라이언트 관점에서 인스턴스들을 동일하게 행동하는 그룹으로 묶기 위함
- 다형성이 런타임에 메세지를 처리하기에 적합한 메서드를 **동적으로 탐색하는 과정**을 통해 구현되며, 상속은 이런 메서드를 찾기 휘한 일종의 탐색 경로를 클래스 계층으로 구현한 방법이라는 것일 이해해 보자.
- 포함 다형성의 관점에서 런타임에 상속 계층 안에서 적절한 메서드를 선택하는 방법을 이해하는 것(위랑 같은말..)

## 1. 다형성

### 1 - 1. 정의

    ⇒ 하나의 추상 인터페이스에 대해 서로 다른 구현을 연결할 수 있는 능력

    ⇒ 한마디로, **여러 타입을 대상으로 동작할 수 있는 코드를 작성하는 방법**

### 1 - 2. 종류

![스크린샷 2021-10-12 오전 10.00.50.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ddf4f382-c733-4637-810b-75eaff6bff26/스크린샷_2021-10-12_오전_10.00.50.png)

- 오버 로딩 다형성
  - 하나의 클래스 안에 동일한 메서드(파라미터의 타입이 다른)가 존재하는 경우
    ```java
    public class Money {
    	public Money plus(Money amount) {...}
    	public Money plus(BigDecimal amount) {...}
    	public Money plus(long amount) {...}
    }

    어차피 TS,JS에서는 사용할 수 없는 형태이다.
    TS가 컴파일되면 어차피 JS가 된다고 할 때, JS는 유형이 없어서
    이러한 행위는 동일한 이름을 가진 두 개의 함수를 사용하는 것이나
    마찬가지이기때문에 TS에서는 이러한 기능을 만드는 것을 제한한다.
    ```
- 강제 다형성
  - 언어가 지원할 수도 사용자가 직접 구현할 수도 있는 타입 변환을 이용해 동일한 연산자를 다양한 타입에 사용할 수 있는 방식을 말한다.
  - ex) 숫자형 + 문자형 연산시 숫자형이 강제로 문자형으로 바뀌는 방식의 타입 변환 동작
  - +) 일반적으로 오버로딩, 강제 다형성을 함께 사용하면 실제로 어떤 메서드가 호출될지 판단하기 어렵기 때문에 같이 쓰지 않는다.
- 매개변수 다형성
  - 제네릭 프로그래밍
  - 실제 인스턴스, 메세드를 사용하는 시점에 구체적인 타입을 지정하는 방식
  ```tsx
  type _type<T> = T;
  const GenericExample = (x: _type<string>): string => x;
  ```
- ⭐️ **포함 다형성**
  - 메세지가 동일하더라도 수신한 객체의 타입에 따라 실제로 수행되는 행동이 달라지는 능력
  - 서브타입 다형성이라고도 부른다.
    - 자식 클래스는 부모 클래스의 서브타입이어야 한다.
  - 객체 지향에서 말하는 다형성은 **특별한 언급이 없는한 이것을 의미한다.**
  - **상속의 진정한 목적은 코드 재사용이 아니라 다형성을 위한 서브타입 계층을 구축하는 것이다.**
  ```tsx
  class Movie {
      constructor(
          private discountPolicy: DiscountPolicy
      ){};

      calculateMovieFee = (screening:Screening) => {
       // 설명 🍌 참조
  		 return fee.minus(this.discountPolicy.calculateDiscountAmount(screening)
      }
  }
  ```
  🍌 ⇒ discountPolicy에게 calculateDiscountAmount 메시지를 전송하지만 실제로 실행되는 메서드는 수신한 객체의 타입에 따라 달라진다.

## 2. 상속의 양면성

상속은 프로그램을 구성하는 개념들을 기반으로 다형성을 가능하게 하는 타입 계층을 구축하기 위한 것이다. 단지, 코드를 재사용하기 위해 상속을 사용하면 이해하기 어렵고 유지 보수하기 버거운 코드가 만들어질 확률이 높다.

- 상속 매커니즘을 이해하기 위한 개념(5가지)
  - 업캐스팅
  - 동적 메서드 탐색
  - 동적 바인딩
  - self 참조
  - super 참조 : 부모 클래스의 가시성 protected, public인 인스턴스 변수와 메서드를 참조한다.
  ### 강의 평가 클래스
  ```tsx
  class Lecture {
    constructor(
      private title: string,
      private pass: number,
      private scores: number[]
    ) {}

    throwScoresError = () => {
      const count = this.scores?.length || 0;
      if (!count) throw new Error("count have to be greater than 0");
    };

    average = () => {
      this.throwScoresError();

      const sum = (a: number, b: number): number => a + b;
      const scoresTotal: number = this.scores.reduce(sum);

      return scoresTotal / this.scores.length;
    };

    getScores = (): number[] => this.scores;

    passCount = (): number => {
      this.throwScoresError();

      const result = this.scores.filter((score) => score >= this.pass).length;

      return result;
    };

    failCount = (): number => {
      this.throwScoresError();

      const result = this.scores.filter((score) => score < this.pass).length;

      return result;
    };

    evaluate = (): string =>
      `Pass: ${this.passCount()} Fail: ${this.failCount}`;
  }

  const lecture = new Lecture("OOP Book", 70, [81, 95, 75, 50, 45]);
  const evaluration: string = lecture.evaluate();
  ```
  ### 상속을 이용해 강의 평가 클래스 재사용하기
  - Lecture 의 결과에 등급별 통계를 추가하는 GraderLecture클래스
  ```tsx
  class GradeLecture extends Lecture {
    constructor(
      title: string,
      pass: number,
      scores: number[],
      private grades: Grade[]
    ) {
      super(title, pass, scores);
    }
  }
  ```
  - 수강생의 등급을 판단하는 Grade 클래스
  ```tsx
  class Grade {
    constructor(
      private name: string,
      private upper: number,
      private lower: number
    ) {}

    getName = (): string => this.name;

    isName = (_name: string): boolean => this.name === _name;

    include = (_score: number): boolean =>
      _score >= this.lower && _score <= this.upper;
  }
  ```
  - GraduLecture 클래스에 학생들의 이수 여부와 등급별 통계를 반환하도록 evaluate 메서드 재정의
  ```tsx
  class GradeLecture extends Lecture {
    constructor(
      title: string,
      pass: number,
      scores: number[],
      private grades: Grade[]
    ) {
      super(title, pass, scores);
    }

    // 부모 클래스의 구현을 새로운 구현으로 대체하는 메서드 오버라이딩
    evaluate = () => super.evaluate() + ", " + this.gradeStatistics();

    gradeStatistics = (): string =>
      this.grades.map((grade: Grade) => this.format(grade)).join(" ");

    format = (grade: Grade): string =>
      `${grade.getName()} : ${grade.getName()}`;

    gradeCount = (grade: Grade): number =>
      super.getScores().filter((score) => grade.include(score)).length;

    // JAVA에서는 오버 로딩이 되지만 JS에서는 이런 개념이 없기 때문에
    // 파라미터 넘기는 형태도 동일시해서 시그니처를 오버라이딩 해버리거나
    // 그게 아니면 변수명을 바꿔서 설정할 수 밖에 없다.
    _average = (gradeName: string): number => {
      return (
        this.grades
          .filter((grade: Grade) => grade.isName(gradeName))
          .map((grade: Grade) => this.gradeAverage(grade))
          .reduce((a: number, b: number) => a + b) / this.grades.length
      );
    };

    gradeAverage = (grade: Grade): number =>
      super
        .getScores()
        .filter((score: number) => grade.include(score))
        .reduce((a: number, b: number) => a + b) / super.getScores.length;
  }

  const lecture = new GradeLecture(
    "OOP Book",
    70,
    [81, 95, 75, 50, 45],
    [
      new Grade("A", 100, 95),
      new Grade("B", 94, 80),
      new Grade("C", 79, 70),
      new Grade("D", 69, 50),
      new Grade("F", 49, 0),
    ]
  );

  // 결과 => "Pass: 3 Fail: 2, A:1, B:1, C:1, D:1, F:1"
  lecture.evaluate();
  ```
  [예제 코드 링크 <= 여기를 눌러주세요](https://www.typescriptlang.org/play?#code/MYGwhgzhAEAyCmwAuBXATvaBvAUNf0wA9gHYRJorJFoAUeBjADmgJYBuYSmSrSI8AFzk2JAOYAaaA0b4WHLpiaQIg6CRQBbAEbw0EmbPmdu0CMQyr1W3WgDaAXUMBKLAF8chpAAs0RAO4AyhbwEACiaH5o0AC80LTOsQB82IaMxGRIhEQoJFlxPqwQAHTmNKEA-MUC4j7QAD710AAMANxpBKwAZrQAhMS5SIk+fv7q8GMRUbQA5AN50N5g7DxE0LrQYhiK0T5gJC0zzu2MHobLemBimHEJgho6esmpsgSFJSMBweXhkTQJJ1e0iB2UyZi0sXiYHuNj0Um0MMeaGciNszzAAGptB18BlyGYQhAACpEJBgEBqB5ogreIqlQnFDAAEyo8FoEC0zhxwKBGFQaAO7MJJLJIGgAHpoO96T9qvBat5Eq0efgzoxrkhvpZIXcqXpHM9pWVLO1DMooABhHILW4ovXRGIpXAg6WfIKEqb-Y6eEF4rKWFAgfJS2klY2hYpdVhBvS0AnlZ7h6BJGl080wZxyhWmkF89AHANBwGqn0ELpgaNWwY6u2wh1O7mu3xfD1-Oje7l+6CF4NGhlRmN0eMYRMhaAAHhDaZU0EzNTEPhzvPg-ILoUDSGL0DVBHgnBAKEUNeEFFY4meAAMAAoqNQAEiw0vTVbyCTc0AAYhWKdAH9Ly5W1pIG4F44G4pqgDOADiaBgEy8AIMg6CYPAAAe3AkEyMCIfymDOgQfqUNQdCNnwAhqCIZ6SNy6aUnWBgguGqj2o4DFAsYR5bHBoSCDB3GOC4LxAhyTCxrw-DwFI6ZSEx3qnKW+B7uSh6mLaiYoKJaDFEpB6KAk0AYtAABEUhGQZU4lFx8GBGSvDkKwwAQACCmbLB1m2UUvCOcelHno6FnFFZEaaGATC0LQQW8W58CJP5-40CFSARdFziJMUABWRBnrM0BHIYhhdAlXA6pF0B8fBKK+WIl4PkFgUrgAcmAmhss4773lgdUak1LVvqBhhBS+wbJdxajlTFqJPP5Il6PVmqEgkkbRtwdBJv5dVnqAKDwUK5SpVmC7eEu+AAPoXLB1wldFPVCGYp7iLWSLJFgKqyHmAoBUFJQDit4WReNsUpBtEA3SN8E3al3IgtD0DFCFYVg7dAOGqGgXRQAgisF1skFkMw-jsiMvALLAGytDQvaEgIvagPQJi2iJJK0pfQdPjcju+BBZjlyXbc-0pZN9bgppc1aqEi0-bGu0YILtMbSQW07eG+3Mqy4UU-R6yy+iWKM8Ls0amLJTzouYGeDgkFQGV0VCbipAiFQSD-DRbAmJgJDNbdVVSC7CimBpmmCz7IIcaYIABHoguCe4LndZ7Pn3dVcWox7LXHdARQ3Tq0AnanmAUYns6CNoRBEAI+wo3SeexDEcS5576ebQe8E6id4Z0UiKIl2X8AV-5bdjimAXh-4TwAGRjznSbjqmJQB3oypmxb9tZAISEjnEJATNb3E4ch9AEzMADyR9XtAABCpcANYzMH+MAOzNFIdgABwAIxSAAnAArFI9+-9Ab+T9oAABZv4ODvjDOwUMgRbzGONWgRl0YmWgG-ZowCf7ODYgTfAcCd47SMufFBn8QFSBfs0LBMDXh4IQUZC0KD76fz-hQ7BOCaHRUQQAERQQANiYYAlhVDZDsO4ogj8KCQH8MEQTJwXIcDiklIABprAA-Nc8IyN4oBqAAMyfm-GoAATFIdGggP4XxMVIC05joCcKsR+ExRkcBr1wtpfcKlWqtCAA) 해당 코드를 통해 **데이터와 행동**이라는 두 가지 관점에서 상속이 가지는 특성을 알아보자.

### 데이터 관점에서의 상속

자식 클래스의 인스턴스 안에 부모 클래스의 인스턴스를 포함하는 것으로 볼 수 있다.

### 행동 관점에서의 상속

부모 클래스가 정의한 일부 메서드를 자식 클래스의 메서드로 포함시키는 것을 의미한다.

어떻게 이런게 가능한 것일까? 실제로 복사하는 작업이 수행된건 아니고 런타임시에 자식 클래스(class pointer)에서 정의되지 않은 메서드는 부모 클래스{parent pointer) 안에서 탐색하게 되어있기 때문이다.

❗️해당 설명은 메모리 구조나 언어 플랫폼에따라 다르지만 최대한 단순화하여 설명할 수 있는 형태이다.

객체의 경우에는 서로 다른 상태를 저장할 수 있도록 각 인스턴스 별로 독립적인 메모리를 할당받아야하지만, 메서드의 경우에는 동일한 클래스의 인스턴스끼리 공유가 가능하기 때문에 클래스는 한 번만 메모리에 로드하고 각 인스턴스별로 클래스를 가리키는 포인터를 갖게 하는 것이 경제적이다. 그림 12-6 참조

## 3. 업캐스팅과 동적 바인딩

업 캐스팅 : 부모 클래스의 타입으로 선언된 변수 자리에 자식 클래스의 인스턴스를 할당하여 사용하는 것

<=> 다운 캐스팅 : 부모 클래스의 인스턴스를 자식 클래스 타입으로 변환하는 것

자식 클래스의 인스턴스는 부모클래스 타입을 언제든 대체가 가능하므로 확장이 용이하다.

동적 바인딩 (=지연바인딩): 선언된 변수의 타입이 아닌 메시지를 수신하는 객체의 타입에 따라 실행되는 메서드가 결정되는 것

<=> 정적바인딩, 초기방인딩, 컴파일 타임 바인딩

## 4. 동적 메서드 탐색과 다형성

![스크린샷 2021-10-17 오전 10.44.14.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6e17c9be-587b-4afd-8976-e1520517942d/스크린샷_2021-10-17_오전_10.44.14.png)

동적 메서드 탐색 과정

- self 참조 ⇒ class 참조 ⇒ parent 참조 ⇒ (=object 참조) 끝에 없으면 오류를 발생시킨다.
  - 메서드 우선 순위 자식 클래스 > 부모 클래스

동적 메서드 탐색 과정의 2가지 원리

- 자동적인 메세지 위임
  - 자신이 이해할 수 없는 메세지의 경우 상속 계층을 따라 부모 클래스에게 처리를 위임한다.
- 동적인 문맥을 이용
  - 컴파일 시점이 아닌 런타임 시점에 객체의 타입을 결정하여 메시지를 처리한다.

메서드 오버라이딩과 오버로딩의 차이

- 오버 라이딩 : 자식 클래스가 부모 클래스와 동일한 시그니처를 가진 메서드를 정의해서 부모 클래스의 메서드를 가리는 것
  - self 전송과 잘못 만나면, 나중에 상속 계층 전부를 뜯어봐야하는 불상사가 일어남으로 주의해야함!
- 오버 로딩 : 자식 클래스가 부모 클래스와 이름은 같고 다른 시그니처를 가진 메서드를 정의했을 때 이것이 공존 할 수 있는 것

```jsx
JS의 경우 클래스 내에서나 상속 관계에서난 오버로딩을 허용하지 않는다.
JS는 코드 작성시 따로 타입을 지정해서 작성을 하지 않기 때문이 아닐까 싶은데,
클래스 내 오버로딩 시도는 그냥 최신의 선언이 실행, 상속 관계 내 오버로딩 시도는 오버라이딩 식으로 실행

class Lecture {
  constructor(title) {
    this.title = title;
  }

  average() {
    return console.log('이게 나오면 오버 로딩')
  }

  average(k) {
    console.log('k가 실행되면 가장 나중에 선언한 메서드가 기존 매서드를 덮어쓴다.')
    return k
  }
}

class GradeLecture extends Lecture {
  constructor(title, grade) {
    super(title);
    this.grade = grade;
  }

  average(str) {
    console.log('str 잘 나왔니? 이게 나왔으면 오버라이드');
  }
}

// 본 코드 실행시 최신의 선언이 실행
console.log(new Lecture().average());

// 본 코드 실행시 GradeLecture의 average메서드가 실행되는 것을 알 수 있다.
console.log(new GradeLecture().average());
```

self 대 super

- self : 메서드 탐색을 해당 클래스 부터 시작한다는 의미
  - 메시지를 수신하는 객체의 클래스에 따라 탐색 위치를 동적으로 결정
- super: 지금 이 클래스의 부모 클래스에서 탐색을 시작하세요 라는 의미
  - 항상 해당 클래스의 부모 클래스에서부터 메서드 탐색을 시작한다.
  - 컴파일 시점에 탐색 위치를 결정할 수 있다.

## 5. 상속 대 위임

위임 : 자신이 정의하지 않거나 처리할 수 없는 속성 또는 메시드의 탐색 과정을 다른 객체로 이동시키기 위해 사용. 이를 위해 위임은 항상 현재의 실행 문맥을 가리키는 self 참조를 인자로 전달한다.

클래스가 존재하지 않는 프로토타입의 객체지향 언어에서 상속을 구현하는 유일한 방법은 객체 사이의 위임이다.

### 5. 1 프로토 타입 기반의 객체지향

- 프로토타입은 부모 객체를 가리키기 위해 사용하는 인스턴스 변수로 봐도 무방하다.
  - 단, self참조를 직접하거나 메시지 포워딩을 번거롭게 할 필요가없다.
    - 언어 차원에서 제공되는 것이라 그러하다.
- 프로토타입은 응답할 적절한 메시지가 없으면 메시지 처리를 자동적으로 위임한다. 상속의 클래스 사이 위임과 유사하다. 이를 JS에서는 프로토타입 체인이라고 한다.
