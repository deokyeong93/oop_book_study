# Chapter 05. 책임 할당하기

> 오브젝트 : 코드로 이해하는 객체지향 설계 &nbsp; / &nbsp; 조영호 저자 &nbsp; / &nbsp; 위키북스
> * 구입처 &nbsp; : &nbsp; [yes24](http://www.yes24.com/Product/Goods/74219491)
    &nbsp; / &nbsp;[교보문고](http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9791158391409&orderClick=LAG&Kc=)
>  * 저작권을 존중하고자 노력합니다. (문제시 private 하겠습니다. )
>  * 책의 내용과 다릅니다.
>
## reference
* [저자 조영호 님 github](https://github.com/eternity-oop/object)

## 목표
* 1회독 완독, 설계, 객체지향 프로그래밍 학습
* 2021.08.02 ~ 08.08 : chapter 01
* 2021.08.09 ~ 08.15 : chapter 02
* 2021.08.16 ~ 08.22 : chapter 03, 04
* 2021.08.23 ~ 08.29 : chapter 05


---


* ch04는 개인적으로 캡슐화, 데이터 중심으로 설계와 변경 차이(리팩토링) 학습


## 01. 책임 주도 설계를 향해


#### 데이터보다 행동을 먼저 결정하라


* 객체의 데이터에서 행동으로 무게 중심을 옮기기
* 책임 중심 설계


> 이 객체가 수행해야 하는 책임은 무엇인가 <br>
> 이 책임을 수행하는 데 필요한 데이터는 무엇인가
>

* 책임을 결정한 후 상태 결정
    * 책임 할당을 어떤 객체에게?
        * 실마리는 **협력**

<br>

#### 협력이라는 문맥 안에서 책임을 결정하라

> 객체가 메시지를 선택하는 것이 아니라 메시지가 객체를 선택하게 해야 한다.
>


* 협력에 적합한 객체


> 협력이란 문맥에서 적절한 책임이란 곧 클라이언트의 관점에서 적절한 책임을 의미한다.
>


* 메시지는 클라이언트의 의도를 표현한다.

<br>

#### 책임 주도 설계


<br>


## 02 책임 할당을 위한 GRASP 패턴

> ***GRASP 패턴***
> &nbsp;  크레이그 라만 (Craig Larman)이 패턴 형식으로 제안 <br>
> &nbsp;  Grneral Responsibility Assignment Software Pattern (일반적 책임 할당을 위한 소프트웨어 패턴)<br>
>

<br>

#### 도메인 개념에서 출발하기

p.137 ~ 

> 올바른 도메인 모델이란 존재하지 않는다.<br>
> 도메인 모델은 도메인을 개념적으로 표현한 것이지만 그 안에 포함된 개념과 관계는 구현의 기반이 돼야 한다.<br>
> 반대로 코드의 구조가 도메인을 바라보는 관점을 바꾸기도 한다.
>


> 도메인 구조가 코드의 구조를 이끈다. <br>
> 변경 역시 도메인 모델의 일부라는 것이다.<br>
> 도메인 모델에는 도메인 안에서 변하는 개념과 이들 사이의 관계가 투영돼 있어야 한다.
>


> 코드의 구조가 도메인의 구조에 대한 새로운 통찰력을 제공한다.
>


* 그림 5.1의 도메인 모델로 시작해서 이번 장의 마지막에 이르면 2장과 동일하게 변경된다.
    * 도메인은 구현에 도움이 되는 모델이어야 한다.


<br>


* 애플리케이션이 제공해야 하는 기능
    * 애플리케이션의 책임
    * 전송된 메시지 : **메시지를 전송할 객체는 무엇을 원하는가**
    * 수신할 객체 선택 : **메시지를 수신할 적합한 객체는 누구인가**
        * **GRASP**
        * 메시지 처리하기 위한 절차, 구현
            * 처리할 작업들
                * 스스로 처리 할 수 없는 작업은? &#8594; 외부에 도움 요청
                * 📬 새 메시지
    * 연쇄적, 메시지 전송과 수신 통한 협력 공동체 구성

* **GRASP**
> **정보 전문가, INFORMATION EXPERT** <br>
> '자율적인 존재' 객체 - 정보를 알고 있는 객체만이 책임을 어떻게 수행할지 결정 할 수 있다.

<br>

> **낮은 결합도, LOW COUPLING 패턴** <br>
> 설계 전체적인 결합도가 낮게 유지되도록 책임 할당<br>
> 설계 결정 평가시 염두해 둬야 하는 원리 중 하나.

<br>

> **높은 응집도, HIGH COHESION 패턴**<br>
> 높은 응집도를 유지할 수 있게 책임 할당, 복잡성을 관리할 수 있는 수준으로 유지<br>
> 설계 결정 평가시 염두해 둬야 하는 원리 중 하나.

<br>

> **창조자, CREATOR PATTERN**<br>
> 의도 : 어떤 방식으로든 생성되는 객체와 연결되거나 관련될 필요가 있는 객체에 해당 객체를 생성할 책임을 맡긴다.<br>
> 두 객체는 서로 결합  &#8594; 낮은 결합도 유지
>


<br>


> **다형성, POLYMORPHISM 패턴**<br>
> 객체의 타입에 따라 변하는 로직을 담당할 책임 할당시<br>
> 타입을 명시적으로 정의하고 각 타입에 다형적으로 행동하는 책임을 할당
>

* SequenceCondition, PeriodCondition 클래스 분해, DiscountCondition 인터페이스 - 책임 분산

* 조건에 따라 프로그램
    * if-else, switch-else
        * 수정이 어렵고 변경에 취약하다.
* 타입(조건)에 따라 여러 대안들을 수행하는 조건적인 논리 사용하지 말고 다형성을 이용해
* 변화를 다루기 쉽게 확장하라.

<br>

> **변경 보호, PROTECTED VARIATIONS 패턴**<br>
> 변화와 불안정성이 다른 요소에 나쁜 영향 미치는 것을 방지하기 위해<br>
> 변화가 예상되는 불안정한 지점들을 식별하여 그 주위에 안정된 인터페이스를 형성하도록 책임 할당
>

* DiscountCondition 인터페이스 통한 movie관점에서의 구현 클래스 캡슐화

<br>



<br>

#### 정보 전문가에게 책임을 할당하라.

* 기능
    * 영화 예매
    * 메시지 전송할 객체의 의도 반영한 메시지
        * "예매하라"
    * 수신할 객체  <mark>GRASP - INFORMATION EXPERT</mark>
        * 상영 Screening
            * 외부 도움 요청
            * 📬 새 메시지 : "가격을 계산하라"
        * Movie
            * 할인 여부 판단 &#8594; 금액 계산
            * 할인 조건? 📬 새 메시지 : "할인 여부를 판단하라"


  <br>



#### 높은 응집도와 낮은 결합도
p.143

* Movie
    * 책임 : 영화 요금 계산
    * 📬 새 메시지 : "할인 여부를 판단하라"
        * (직접)&#8594; DicountCondition ?
            * <mark>GRASP - LOW COUPLING</mark>
            * <mark>GRASP - HIGH COHESION</mark>
        * Screning &#8594; DiscountCondition?

      
<br>

#### 창조자에게 객체 생성 책임을 할당 하라


* 최종 결과물, Reservation 인스턴스 생성
    * WHO? Reservation 인스턴스 생성 책임
        * <mark>GRASP - CREATOR PATTERN</mark>


<br>


## 3 구현을 통한 검증

p.146


<br>

#### DiscountCondition 개선하기

``` java
    public boolean isSatisfiedBy(Screening screening) {
        if (type == DiscountConditionType.PERIOD) {
            return isSatisfiedByPeriod(screening);
        }

        return isSatisfiedBySequence(screening);
    }

    private boolean isSatisfiedByPeriod(Screening screening) {
        return dayOfWeek.equals(screening.getWhenScreened().getDayOfWeek()) &&
                startTime.compareTo(screening.getWhenScreened().toLocalTime()) <= 0 &&
                endTime.compareTo(screening.getWhenScreened().toLocalTime()) <= 0;
    }

    private boolean isSatisfiedBySequence(Screening screening) {
        return sequence == screening.getSequence();
    }
```


* 변경에 취약한 클래스 : 수정해야 하는 이유를 하나 이상 가지는 클래스(낮은 응집도) ↔️ SRP
    * 새로운 할인 조건 추가
    * 순번조건 판단 로직 변경
    * 기간 조건 판단 로직 변경

> 낮은 응집도가 초래한 문제 해결하기 위해서 **변경의 이유에 따라 클래스 분리**
>


* 변경의 이유 파악하기
    * 인스턴스 변수가 초기화 되는 시점 <br>
      ✔️응집도가 낮은 클래스 : 객체의 속성 중 일부만 초기화, 일부는 초기화 되지 않은 상태로 남겨진다.
    * 메서드들이 인스턴스 변수를 사용하는 방식<br>
      ✔️응집도가 낮은 클래스 : 메서드마다 사용하는 속성의 그룹이 나뉜다.
        * isSatisfiedByPeriod() , isSatisfiedBySequence() 의 파라미터들과 속성들


<br>

---


#### 타입 분리하기

p.156
step02

* 수정 후, Movie와 2개의 서로 다른 클래스의 인스턴스와의 협력
    * Movie 안에 각 할인 조건 목록 유지
        * 각각의 할인 조건 클래스와 결합 → ⛔ 결합도 증가


#### 다형성을 통해 분리하기

step03

> Movie가 구체적인 클래스는 알지 못한 채 오직 역할에 대해서만 결합되도록 의존성을 제한 할 수 있다.
>


* Movie 입장 : 할인여부 반환 = SequenceCondition, PeriodCondition
  * <mark>GRASP - POLYMORPHISM 패턴</mark>



* DiscountCondtion 인터페이스
    * implements DiscountCondition
        * SequenceCondition, PeriodCondition 인스턴스가 DiscountCondition 인터페이스 실체화
        


#### 변경으로부터 보호하기


* SequenceCondition, PeriodCondition
    * 두 클래스의 존재를 Movie는 모른다.
        * DiscountCondtion 인터페이스 추상화가 구체적인 타입을 캡슐화
    * <mark>GRASP - PROTECTED VARIATIONS 패턴</mark>



#### Movie 클래스 개선하기
step04

``` java
    private Money calculateDiscountAmount() {
    switch(movieType) {
        case AMOUNT_DISCOUNT:
            return calculateAmountDiscountAmount();
        case PERCENT_DISCOUNT:
            return calculatePercentDiscountAmount();
        case NONE_DISCOUNT:
            return calculateNoneDiscountAmount();
    }
    throw new IllegalStateException();
```

* 할인 정책의 2가지 타입을 하나의 클래스 안에 구현 - 변경이유 : 낮은 응집도
    * 타입별로 분리(다형성)
        * <mark>GRASP - POLYMORPHISM 패턴</mark>
    * Screening과 Movie가 메시지 통해서만 다형적으로 협력
        * Movie에 타입 추가해도 Screening에 영향 없음
            * 인터페이스에 의해 타입 종류가 캡슐화 됐다.
        * <mark>GRASP - PROTECTED VARIATIONS 패턴</mark>
    * AmountDiscountMovie, PercentDiscountMovie, NoneDiscountMovie
        * 계산 로직시 필요로 Movie에 getFee() 추가
            * 서브클래스에서만 사용하므로 가시성을 protected로 제한



<br>


#### 변경과 유연성

p.163

> 개발자가 변경에 대비하는 2 가지 방법<br>
> &nbsp; 1️⃣ 코드를 이해하고 수정하기 쉽도록 단순하게 설계 하기<br>
> &nbsp; 2️⃣ 코드 수정 없이, 변경을 수용하도록 코드를 유연하게 작업<br>
> &nbsp; 대부분 1️⃣이 더 좋지만, 유사한 변경이 반복적 일 땐 복잡성이 높아지더라도 2️**유연성**을 추가하는 방향으로 한다.<br>
>

* 추가된 요구사항 : 영화에 설정된 할인 정책을 실행 중에 변경하도록 해주세요. 👻
    * setp04의 설계된 상속응 이욜한 할인 정책과 변경에 대비 방법은?
    * 대부분 1️⃣이 더 좋지만, 유사한 변경이 반복적 일 땐 복잡성이 높아지더라도 2️**유연성**을 추가하는 방향으로 한다.



<br>


## 04 책임 주도 설계의 대안

> **리팩터링, REFACTORING** <br>
> 이해하기 쉽고 수정하기 쉬운 소프트웨어로 개선하기 위해 겉으로 보이는 동작은 바꾸지 않은 채 내부 구조 변경 <br>
>


#### 메서드 응집도
* 4장에서의 데이터 중심으로 설계한 영화 예매 시스템에서 ReservationAgency의 로직들을 적절한 객체의 책임으로 분배하며 실습


* **몬스터 메서드 Monster method**
    * 긴 메서드는 응집도가 낮아 이해하기도 어렵고 재사용하기도 어려우며 변경하기도 어렵다.
        * 긴 메서드는 이해를 돕기 위해 대부분 주석이 필요
            * 주석을 추가하는 대신 메서드를 작게 분해
        * <mark>응집도 높은 메서드</mark>는 변경되는 이유가 단 하나여야 한다. SRP
    * 짧고 이해하기 쉬운 이름으로 된 메서드 : 명확성


  <br>


#### 객체를 자율적으로 만들자

* 메서드가 사용하는 데이터를 저장하는 클래스로 메서드 이동시키기

* 내부 구현을 캡슐화
