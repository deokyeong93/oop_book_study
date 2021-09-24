# Chapter 8 의존성 관리하기

> 오브젝트 : 코드로 이해하는 객체지향 설계 &nbsp; / &nbsp; 조영호 저자 &nbsp; / &nbsp; 위키북스
>
> - 구입처 &nbsp; : &nbsp; [yes24](http://www.yes24.com/Product/Goods/74219491)

    &nbsp; / &nbsp;[교보문고](http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9791158391409&orderClick=LAG&Kc=)

> - 저작권을 존중하고자 노력합니다. (문제시 private 하겠습니다. )
> - 책의 내용과 다릅니다.

## reference

- [저자 조영호 님 github](https://github.com/eternity-oop/object)

## 목표

- 1회독 완독, 설계, 객체지향 프로그래밍 학습
- 2021.08.02 ~ 08.08 : chapter 01
- 2021.08.09 ~ 08.15 : chapter 02
- 2021.08.16 ~ 08.22 : chapter 03, 04
- 2021.08.23 ~ 08.29 : chapter 05
- 2021.08.30 ~ 09.05 : chapter 06
- 2021.09.06 ~ 09.12 : chapter 07 (각자 읽기)
- 2021.09.13 ~ 09.26 : chapter 08, 09

---

### 챕터8

> 객체지향 설계의 핵심은 협력을 위해 필요한 의존성은 유지하고  
> 변경을 방해하는 의존성은 제거하여 객체가 변화를 받아들일 수 있게  
> 의존성을 정리하는 것이다

## 1. 의존성을 이해하기

### 변경과 의존성

- 객체가 예정된 작업을 정상적으로 수행하기 위해 다른 객체를 필요로 하는 경우 두 객체 사이에 의존성이 발생
- 의존성은 방향성을 가지며 항상 단방향
- 의존성은 의존되는 요소가 변경될 때 의존하는 요소도 함께 변경될 수 있음을 의미한다

### 의존성 전이

```typescript
 class PeriodCondition implements DiscountCondition {
    private _dayOfWeek: number;
    private _startTime: number;
    private _endTime: number;

    constructor(dayOfWeek: number, startTime: number, endTime: number) {
      this._dayOfWeek = dayOfWeek;
      this._startTime = startTime;
      this._endTime = endTime;
    }

    isSatisfiedBy(screening: Screening): Boolean {
      const { startTime } = screening;
      return (
        startTime.getDay() === this._dayOfWeek &&
        this._startTime <= startTime.getTime() &&
        this._endTime >= startTime.getTime()
      );
    }
  }

class Screening {
    constructor(
      private _movie: Movie,
      private _sequence: number,
      private _whenScreened: Date
    ) {}

```

- 의존성 전이란 위 코드로 보았을 때, PeriodCondition 클래스가 Screening에 의존할 경우, 자연스럽게 Screening이 의존하는 Movie 등에 대한 의존성도 자동적으로 의존하게 된다는 것
- 실제 전이의 여부는 변경의 방향과 캡슐화의 정도에 따라 달라진다
- 직접의존성 : 한 요소가 다른 요소에 직접 의존하는 경우(PeriodCondition -> Screening), 코드에 명시적으로 의존성이 드러난다
- 간접의존성 : 직접적인 관계는 존재하지 않지만 의존성 전이에 의해 영향이 전파되는 경우(PeriodCondition 입장에서 Screening의 내부구현이 변경되고 그것이 영향을 미칠 때)
  > 의존성은 클래스를 넘어 객체, 모듈, 실행 시스템 모두에 해당 가능하다  
  > 의존성의 본질은 변경에 영향을 받을 수 있는 가능성이다.

### 런타임 의존성과 컴파일타임 의존성

- 런타임 : 애플리케이션이 실행되는 시점, 주인공은 객체.
- 컴파일타임 : 코드를 작성하고 컴파일하는 시점, 주인공은 클래스.
- 코드 작성 시점에는 다른 클래스의 존재를 모르지만, 런타임 시점에는 다른 클래스의 인스턴스와 협력하게 된다.
- 실제로 협력할 객체가 어떤 것인지는 런타임에 해결해야 한다.
- 따라서 컴파일타임 구조와 런타임 구조 사이의 거리가 멀면 멀수록 설계가 유연하고 재사용 가능해진다.

### 컨텍스트 독립성

- 클래스는 자신과 협력할 객체의 구체적인 클래스에 대해 알아서는 안된다. 문맥에 강하게 결합되기 때문이다.
- 클래스가 사용될 특정한 문맥에 대해 최소한의 가정만으로 이뤄져 있다면 다른 문맥에서 재사용하기가 더 수월해진다. 이것이 컨텍스트 독립성이다.
- 클래스가 실행 컨텍스트에 독립적인데도 어떻게 런타임에 실행 컨텍스트에 적절한 객체들과 협력하지?

### 의존성 해결하기

- 컴파일타임 의존성을 실행 컨텍스트에 맞는 적절한 런타임 의존성으로 교체하는 것을 의존성 해결이라고 한다.
- 세 가지 방법을 주로 사용한다.
  1. 객체를 생성하는 시점에 생성자를 통해 의존성 해결
  2. 객체 생성 후 setter 메서드를 통해 의존성 해결
  - 장점: 실행 시점에 의존 대상 변경이 가능해 유연하다
  - 단점: 객체의 상태가 불완전할 수 있어 NullPointException 위험이 있다.
  - 생성자 방식과 혼합할 경우, 완전한 상태의 객체에서 setter를 활용해 의존 대상을 바꿀 수 있다.
  3. 메서드 실행 시 인자를 이용해 의존성 해결
  - 일시적인 의존 관계에 유용하다.
  - 실행 시점마다 의존 대상이 달라지는 경우에도 유용하다.

```java
//1.
Movie avatar = new Movie(A, B, C, new PercentDiscountPolicy(...));
//2.
Movie avatar = new Movie(...));
avatar.setDiscountPolicy(new AmountDiscountPolicy(...));
//1+2. 가장 선호되는 방법
Movie avatar = new Movie(A, B, C, new PercentDiscountPolicy(...));
...
avatar.setDiscountPolicy(new AmountDiscountPolicy(...));

//3. 항상 할인 정책을 알 필요 없고 가격을 계산할 때만 일시적으로 알아도 무방한 경우
public class Movie {
    public Money calculateMovieFee(Screening screening, DiscountPolicy discountPolicy) {
        return fee.minus(discountPolicy.abc(screening));
    }
}
```

2. 유연한 설계

### 의존성과 결합도

- 객체들이 협력하기 위해서는 서로의 존재와 수행 가능한 책임을 알아야 한다.
- 의존성은 객체간 협력을 가능하게 만드는 관점에서 바람직하지만, 과하면 문제가 된다.
- 바람직한 의존성은 다양한 환경에서 재사용 가능한 의존성을 뜻한다.
- 다른 환경에서 재사용하기 위해 내부 구현을 변경하게 만드는 의존성은 바람직하지 않다.
- 결합도란 의존성에 대한 용어이며 바람직한 의존성에 대해 느슨한, 또는 약한 결합도라 부른다.
- 반대로 바람직하지 못할 때는 단단한, 또는 강한 결합도라 부른다.

### 지식이 결합을 낳는다.

- 서로에 대해 알고 있는 지식의 양이 결합도를 결정한다.

```typescript
class Movie {
  constructor(private fee: Money, private discountPolicy: DiscountPolicy) {}

  calculateMovieFee = (screening: Screening): Money => {
    return this.fee.minus(
      this.discountPolicy.calculateDiscountAmount(screening).getAmount()
    );
  };

  getFee = (): Money => {
    return this.fee;
  };
}
```

- 위 코드 처럼 Movie 가 discountPolicy라는 추상 클래스에 의존한다면 구체적인 계산 방법을 알 필요가 없다. 반면 직접 계산을 구현한 클래스에 의존한다면 구체적인 계산 방법을 알게 된다.
- 느슨한 결합을 달성하는 가장 효과적인 방법이 바로 추상화다.

### 추상화에 의존하라

- 추상화란 어떤 양상, 세부사항, 구조를 좀 더 명확하게 이해하기 위해 특정 절차나 물체를 의도적으로 생략하거나 감춤으로써 복잡도를 극복하는 방법.
- 일반적으로 추상화와 결합도의 관점에서 의존 대상을 다음과 같이 구분하는 것이 유용하다. 아래로 갈 수록 결합도가 느슨하다.
  - 구체 클래스 의존성(concrete class dependency)
  - 추상 클래스 의존성(abstract class dependency)
  - 인터페이스 의존성(interface dependency)
    - 인터페이스에 의존하면 상속 계층을 모르더라도 협력이 가능하다.
- 중요한 것은, 실행 컨텍스트에 대해 알아야 하는 정보를 줄일수록 결합도가 낮아진다는 것이다.
- 의존하는 대상이 더 추상적일수록, 결합도는 더 낮아진다.

### 명시적인 의존성(explicit dependency)

- 모든 경우에 의존성은 명시적으로 퍼블릭 인터페이스에 노출되는데, 이를 명시적인 의존성이라 한다.
- 반면 constructor에 인자로 전달받지 않고 직접 객체의 내부에서 인스턴스를 생성하는 방식은 의존성이 퍼블릭 인터페이스에 표현되지 않는다. 이를 숨겨진 의존성(hidden dependency)라고 한다.
- 의존성은 명시적이어야 하며, 퍼블릭 인터페이스에서 노출되어야 한다.
- 그래야만 코드 수정의 위험을 최소화하고, 코드 파악이 더 쉬워지며, 컴파일 타임 의존성을 적절한 런타임 의존성으로 교체할 수 있다.

### new는 해롭다

- 이유?
  1. new 연산자를 사용하기 위해서는 구체 클래스의 이름을 직접 기술해야 한다. 따라서 new를 사용하는 클라이언트는 추상화가 아닌 구체 클래스에 의존할 수 밖에 없기 때문에 결합도가 높아진다.
  2. new 연산자는 생성하려는 구체 클래스 뿐만 아니라 어떤 인자를 이용해 클래스의 생성자를 호출해야 하는지도 알아야 한다. 따라서 new를 사용하면 클라이언트가 알아야 하는 지식의 양이 늘어 결합도가 높아진다.
- 결합도의 관점에서 구체 클래스만으로도 문제인데, new는 구체클래스 생성에 대한 정보까지 알아야 한다는 점에서 지식이 너무 많이 필요하다.
- new로 생성한 인스턴스와 전달되는 인자를 클래스 안에서 직접 의존할 경우 변경에 몹시 취약해진다.
- 해결법?
  - 인스턴스를 생성하는 로직과 생성된 인스턴스를 사용하는 로직을 분리하라.
  - 의존성 해결 방법과 동일하다.

```typescript
// 필요한 인스턴스를 생성자의 인자로 전달받아 내부 인스턴스 변수에 할당
class Movie {
    private DiscountPolicy discountPolicy;
    constructor(title:string, runningTime:Duration, fee:Money, discountPolicy:DiscountPolicy){
        this.discountPolicy = discountPolicy;
    }
}
// AmountDiscountPoliocy의 인스턴스를 생성하는 책임은 Movie의 클라이언트가 된다.
// 생성과 사용의 분리
const avatar = new Movie(q, w, e, new AmountDiscountPoliocy(a, new b(), new c()...));
```

- 생성의 책임을 클라이언트에 옮김으로서 Movie는 DiscountPolicy의 모든 자식 클래스와 협력이 가능해졌다
- 객채 생성의 책임을 옮김으로서 유연한 설계를 달성한다.

### 가끔은 생성해도 무방하다.

- 클래스 안에서 객체의 인스턴스를 직접 생성하는 방식이 유용한 경우도 있다.
- 사용 빈도의 문제로, 거의 매번 Movie가 AmountDiscountPolicy의 인스턴스와 협력한다면 매번 클라이언트가 인스턴스를 생성하는 것은 사용성이 나빠질 것이다.
- 기본 객체를 생성하는 생성자를 추가하고 이 생성자에서 DiscountPolicy의 인스턴스를 인자로 받는 생성자를 체이닝하거나, 메서드를 오버로딩하는 방법을 통해 해결할 수 있다.
- 설계는 트레이드오프 활동이다. 사용성이 중요하다면 결합도를 높일 수도 있다.
- 모든 결합도가 모이는 새로운 클래스를 추가하여 사용성과 유연성 두 마리 토끼를 잡을 수 있는 경우도 있다.

### 표준 클래스에 대한 의존은 해롭지 않다.

- 내장 객체에 대한 생성자 선언은 해롭지 않다. 변경 가능성이 거의 없기 때문이다.

### 컨텍스트 확장하기

```typescript
class Movie {
  constructor(
    private title: string,
    private runningTime: number,
    private fee: Money,
    private discountPolicy: DiscountPolicy
  ) {
    this.discountPolicy = discountPolicyp;
  }

  calculateMovieFee = (screening: Screening): Money => {
    // 예외 케이스를 추가함으로써 내부 코드를 수정하게됨
    if (discountPolicy == null) {
      return fee;
    }
    return this.fee.minus(
      this.discountPolicy.calculateDiscountAmount(screening)
    );
  };
}
// 조건 없이 할인 혜택 제공 없는 영화 구현
// 이렇게 할 경우 예외를 체크할 필요가 없다.
class NoneDiscountPolicy extends DiscountPolicy {
  getDiscountAmount(screening: Screeing): Money {
    return Money.wons(0);
  }
}

const avatar = new Movie("a", "b", "c", new NoneDiscountPolicy());
```

- Movie를 수정하지 않고도 새로운 조건이나 기능을 추가할 수 있다.
- 단지 원하는 기능을 구현한 추상클래스의 자식 클래스를 추가하고, 인스턴스를 Movie에 전달하면 된다.
- 협력해야 하는 객체를 변경하는 것만으로도 Movie를 새로운 컨텍스트에서 재사용할 수 있다.
- 즉, 객체가 추상화에 의존하고, 생성자를 통해 의존성을 명시적으로 드러내며, 구체 클래스를 직접적으로 다루는 책임을 객체의 외부로 넘김으로써 결합도는 낮추고 컨텍스트는 확장 가능해졌다. 이것이 유연하고 재사용 가능한 설계를 만드는 핵심이다.

### 조합 가능한 행동

- 유연하고 재사용 가능한 설계는 객체가 어떻게(how)하는 지를 나열하지 않고도 조합을 통해 무엇(what)을 하는지를 표현하는 클래스들로 구성된다.
- 작은 객체들의 행동을 조합함으로써 새로운 행동을 이끌어 낼 수 있어야 한다.
- 훌륭한 객체지향 설계란 객체가 어떻게 하는지를 표현하는 것이 아니라 객체들의 조합을 선언적으로 표현함으로써 객체들이 무엇을 하는지를 표현하는 설계다.
  > 핵심은 의존성 관리다!  
  > 방법이 아니라 목적에 집중하는 시스템이 행위의 변경에 더 유연하다.
