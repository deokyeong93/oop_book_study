# Chapter 9 유연한 설계

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

> 이름을 가진 설계 원칙을 통해 기법들을 정리하는 과정을 통해앞 장에서 배운 장황한 개념과 매커니즘을 또렸하게 정리하는 것을목표로 한다.

## 1. 개방 - 폐쇄의 원칙

### 확장과 수정

- 확장 : 새로운 요구 사항에 대해 새로운 기능을 추가함으로서 기능을 확장하는 것이 가능
- 수정 : 기존의 '코드'의 수정 없이 기능을 추가 변경할 수 있다.

> 확장과 수정이 가능하도록 하기 위해서는 어떻게 해주어야할까?

1.  컴파일 타임 의존성을 고정시키고, 런타임 의존성을 변경해준다.
2.  1번 개념을 위해 추상화는 핵심적인 절차이다. 코드를 통해 좀 더 자세히 살펴보도록 하자 (책이 아닌 임의의 예제).

그 전에 간략히 설명하자면, 손님 객체와 바리스타 객체가 있다고하자. 각 바리스타는 각각 전문 분야가 있다고하자. 그러나 손님 입장에서는 어떤 바리스타든 커피를 만든다는 '메시지'를 책임질 수 있기만 하면 된다. 이 때 바리스타는 ('아마추어 바리스타', '프로 바리스타', '준프로 바리스타', '파트타임 바리스타')가 있다고 할 때

```typescript
class Customer {
  ...
  order() {
    ...
    if(...) return amaBarista.makeCoffee();
    if(...) return semiProBarista.makeCoffee();
    return proBarista.makeCoffee();
  }
}
```

이런 식으로 특정한 바리스타에게 메세지를 할당하는 것은 Customer자체의 외부와 결합도를 높이고 응집도를 낮추게 된다. 당연히 확장과 수정의 관점에서 점점 좋지 않은 설계가 될 것 이다.

> why? 꼬맹이 바리스타가 추가된다고 가정하자. 우리는 새로운 기능을 추가하는 과정에서 Customer의 '내부'를 수정해주어야한다. 내부의 코드를 수정하는 일은 언제나 '버그'를 만들 수 있다.

> 그렇다면 어떻게 하는 것이 좋을까?

```typescript
abstract class Barista {
  ...
  abstract makeCoffee(): void;
}

class proBarista extends Barista {
  makeCoffee(): Coffee {}
}
```

이런식으로 추상화를 진행해주면

```typescript
class Customer {
  ...
  order(_barista: Barista) {
    ...
    return _barista.makeCoffee();
  }
}
```

로 컴파일 상태에서는 Barista의 인스턴스에 의존하고 런타임시에는 적절한 바리스타의 인스턴스에 의존할 수 잇을 것이다.

✨ cf) 의존성을 해결하는 방법 (8장 localhost님 정리 중)

1. 객체를 생성하는 시점에 생성자를 통해 의존성 해결
2. 객체 생성 후 setter 메서드를 통해 의존성 해결

- 장점: 실행 시점에 의존 대상 변경이 가능해 유연하다
- 단점: 객체의 상태가 불완전할 수 있어 NullPointException 위험이 있다.
- 생성자 방식과 혼합할 경우, 완전한 상태의 객체에서 setter를 활용해 의존 대상을 바꿀 수 있다.

3. 메서드 실행 시 인자를 이용해 의존성 해결

- 일시적인 의존 관계에 유용하다.
- 실행 시점마다 의존 대상이 달라지는 경우에도 유용하다.

## 2. 생성과 사용의 분리

위의 코드와 조금 다르지만 만약 Customer가 pro커피를 얻기 위해 이러한 코드를 사용한다고 해보자. 결합도가 높고 응집도는 낮은 코드이다.

```typescript
class Customer {
  ...
  getProCoffee() {
    const barista = new ProBarista(...abc);

    return barista.makeCoffee();
  }
}
```

본 코드는 직접 생성과 사용을 같이 하고 있기 때문이다. 본 코드의 생성 책임을 Factory라는 생성에 특화된 객체에게 맡겨보자.

```typescript
class Factory {
  createProBarista() {
    return new ProBarista(...abc);
  }
}
```

```typescript
class Customer {
  constructor(factory) {
    this.factory = factory;
  }

  getProCoffee() {
    const proBarista = facotry.createProBarista();
    return proBarista.makeCoffee();
  }
}
```

제 코드는 짧아서 딱히 생성과 분리의 장점이 와 닿지 않을 수 있습니다. 그러나 ProBarista를 생성할 때 인자로 생성자가 들어간다고 생각해보자. 모든 생성의 책임을 Factory라는 클래스로 넘김으로써 Customer의 결합도는 factory로만 한정시킬 수 있고, 단순히 Factory를 사용하기만 하면 되는 사용의 책임만들 남김으로서

결합도는 낮고 응집도는 높은 코드를 만들 수 있다.

## 3. 의존성 주입

일부 8장과 겹쳐 숨겨진 의존성에 관련하여 집중적으로 다루겠습니다.

### 숨겨진 의존성은 나쁘다.

```typescript
class Movie {
  constructor(
    private titie: string,
    private duration: number,
    private fee: number
  ) {
    this.discountPolicy = ServiceLocator.discountPolicy();
  }
}
```

해당 코드의 discountPolicy는 의존성은 ServiceLocator에게 할당되어있다. 다른 코드들과 달리 할인 정책을 ServiceLocator가 할당해준다. 그런데 갑자기오류가 발생했다. 오류가 발생한 곳의 코드는 이러하다.

```typescript
const avater = new Movie("아바타", 120, 10000);
avater.calculateMovieFee(screenig);
```

개발자는 다음과 같은 코드를 봤을 때 실행 이전에는 왜 오류가 발생했는지 파악하기 힘들다. 생성자에서 요구하는 파라미터를 모두 전달했고, 발생한 오류가 할인정책과 관련이 있는데 도무지 다음 코드만 봐서는 할인정책과의 의존성이 보이지 않기 때문이다.

이는 결국 런타임 시 확인할 수 밖에 없는데, 이처럼 의존성을 드러내지 않고 객체 내부로 숨겨버리면 추후 의존성과 관련된 에러가 발생했을 때 파악하기 힘들어진다. 따라서 의존성을 숨기는 것은 의존성 이해를 위해 내부 구현 이해를 강요하는 캡슐화를 위반하는 행위이므로 해서는 안 된다.

## 4. 의존성 역전 원칙

-. 상위 수준의 모듈은 하위 수준의 모듈에 의존해서는 안 된다. 둘 모두 추상화에 의존해야한다. -. 추상화는 구체적인 사항에 의존해서는 안 된다. 구체적인 사항은 추상화에 의존해야 한다.

구체적인 예시를 1. 개방 폐쇄의 원칙에서 살펴보았다. 특정 하위 수준의 모듈에 의존하는 것은 확장과 수정을 힘들게 만든다.

## 5. 유연성에 대한 조언

-. 유연함과 단숨함, 명확함은 트레이드 오프 같은 것이다. -. 유연할수록 복잡한 코드일 확률이 높다. -. 단순하고 명확한 코드는 나쁜 것이 아니다. 지레 짐작하여 너무 높은 유연성을 주지는 말자. -. 협력과 책임을 중심으로 모든 책임을 자리시킨 후 설계에 유연성을 더할지 말지 결정해도 늦지 않다.
