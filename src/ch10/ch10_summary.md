# Chapter 010 상속과 코드 재사용

### 주제
- **객체지향에서 클래를 재사용하는 전통적인 방법**: 새 클래스를 추가하는 것
- **상속**: 새로운 클래스를 추가하는 가장 대표적인 기법
- **합성**: 새로운 클래스의 인스턴스 안에 기존 클래스의 인스턴스를 포함시키는 방법
---

## 01. 상속과 중복 코드
- 중복 코드는 우리를 주저하게 만들고, 의심과 불신을 낳는다.

### DRY 원칙
- 중복 코드의 문제
  - 코드의 변경을 방해한다.
  - 코드를 수정하는 데 필요한 노력을 몇 배로 증가
    > 중복 코드 찾기 -> 중복된 모든 코드 일관되게 수정 -> 모든 코드 개별 테스트 -> 수정과 테스트에 드는 비용 증가
- **DRY 원칙**
  - **[Don't Repeat Yourself]** 반복하지 마라
  - **[Once and Only once 원칙]** (한 번, 단 한 번) 또는 **[단일 지점 제어 원칙]** (Single-Point Control)이라고 부름

### 중복과 변경
- 중복 코드 살펴보기
  - '심야 할인 요금제'라는 새로운 요금 방식 추가
    - 기존 요금제는 '일반 요금제'로 부름
    - phone의 코드를 복사해서 NightlyDiscountPhone이라는 새로운 클래스 만든 후 수정
    - 두 개의 클래스에는 중복 코드가 존재
- 기존 요금제 구조
```java
public class Phone {
  private Money amount;
  private Duration seconds;
  private List<Call> calls = new ArrayList<>();

  public Phone(Money amout, Duration seconds) { ... }
  public void call(Call call) { ... }
  public List<Call> getCalls() { ... }
  public Money getAmount() { ... }
}
```
- 심야 할인 요금제 구조
```java
public class NightlyDiscountPhone {
  private static final int LATE_NIGHT_HOUR = 22;

  private Money nightlyAmount;
  private Money regularAmount;
  private Duration seconds;
  private List<Call> calls = new ArrayList<>();

  public NightlyeDiscountPhone(Money nightlyAmout, Money regularAmount, Duration seconds) { ... }
  public Money calculateFee() { ... }
}
```
- 중복 코드 수정하기
  - 통화 요금에 부과할 세금 계산: 중복 코드가 코드 수정에 미치는 영향을 살펴보기 위해 요구사항 추가
  - Phone, NightDiscountPhone 두 개의 클래스의 calculateFee 메서드 수정 필요
  - 중복 코드는 새로운 중복 코드를 부른다
- 타입 코드 사용하기
  - 두 클래스 사이의 중복 코드를 제거하는 방법: 클래스를 하나로 합치는 것 (타입 추가)
    - 요금제를 구분하는 타입 코드를 추가
    - 타입 코드의 값에 따라 로직을 분기
    - 타입 코드를 사용하는 클래스는 낮은 응집도와 높은 결합도라는 문제
  - **상속**: 타입 코드를 사용하지 않는 효과적인 방법

### 상속을 이용해서 중복 코드 제거하기
- **상속**: 이미 존재하는 클래스와 유사한 클래스가 필요할 때, 복사하지 않고 재사용
  - 10시 이전의 통화 요금: phone에 구현된 로직 재사용
  - 10시 이후의 통화 요금: NightlyDiscountPhone에서 구현
- 상속을 염두에 두고 설계되지 않은 클래스를 상속을 이용해 재사용하는 것은 쉽지 않다.
  - 실제 비즈니스 로직에서는 이해하기 어려운 가정과 마주하게 됨
- 구현 방법에 대한 정확한 지식이 없을 경우: **상속**은 결합도를 높이고, 코드 수정을 어렵게 한다.
```java
public class NightlyDiscountPhone extends Phone {
  ...

  @Override
  public Money calculateFee() {
    // 부모 클래스의 calculateFee 호출
    Money result = super.calculateFee();
    ...
    return result.minus(nighlytFee);

  }
}
```

### 강하게 결합된 Phone과 NightlyDiscountPhone
- 부모 클래스와 자식 클래스 사이의 결합이 문제인 이유
  - 세금 부과하는 요구 사항 추가: Phone / NightlyeDiscountPhone 둘 다 texRate를 이용해 세금을 부과해야 한다.
  - 로직 추가를 위해 Phone과 유사한 코드를 NightlyeDiscountPhone에도 추가 (중복 코드 생성)
- **상속을 위한 경고 1**
  > 자식 클래스의 메서드 안에서 super 참조를 이용해 부모 클래스의 메서드를 직접 호출할 경우 두 클래스는 강하게 결합된다. super 호출을 제거할 수 있는 방법을 찾아 결합도를 제거하라.
- **취약한 기반 클래스 문제**: 코드 재사용을 목적으로 상속을 사용할 때 발생하는 대표적인 문제

---
## 02. 취약한 기반 클래스 문제
> Fragile Base Class Problem, Brittle Base Class Problem
- 상속이라는 문맥 안에서 결합도가 초래하는 문제점을 가리키는 용어
- 취약한 기반 클래스 문제는 캡슐화를 약화시키고 결합도를 높인다.

### 불필요한 인터페이스 상속 문제
- 초기 버전 자바에서 상속을 잘못 사용한 사례: java.util.Properties와 java.util.Stack
  - Stack에게 상속된 Vector의 퍼블릭 인터페이스를 이용하면 임의의 위치에서 요소 추가/삭제 가능
  - Properties는 상속된 Hashtable의 put 메서드를 이용하면 String 타입 이외의 키와 값을 저장 가능
- **상속을 위한 경고 2**
  > 상속받은 부모 클래스의 메서드가 자식 클래스의 내부 구조에 대한 규칙을 깨트릴 수 있다.

### 메서드 오버라이딩의 오작용 문제
- HashSet의 구현에 강하게 결합된 InstrumentedHashSet 클래스
```java
InstrumentedHashSet<String> langguages = new InstrumentedHashSet<>();
languages.addAll(Arrays.asList("Java", "Ruby", "Scale"));
```
- addCount의 값은 3이 아니라 6: 부모 클래스인 HashSet의 addAll 메서드 안에서 add 메서드를 호출하기 때문에
- **상속을 위한 경고 3**
  > 자식 클래스가 부모 클래스의 메서드를 오버라이딩할 경우 부모 클래스가 자신의 메서드를 사용하는 방법에 자식클래스가 결합될 수 있다.
- 설계는 트레이드 오프: 상속은 코드 재사용을 위해 캡슐화를 희생. 완벽한 캡슐화를 원한다면 코드 재사용을 포기하거나 상속 이외의 다른 방법 사용

### 부모 클래스와 자식 클래스의 동시 수정 문제
- 코드 재사용을 위한 상속은 부모 클래스와 자식 클래스를 강하게 결합시키기 때문에 함께 수정해야 하는 상황 역시 빈번하게 발생할 수 있다.
- **상속을 위한 경고 4**
  > 클래스를 상속하면 결합도로 인해 자식 클래스와 부모 클래스의 구현을 영원히 변경하지 않거나, 자식 클래스와 부모 클래스를 동시에 변경하거나 둘 중 하나를 선택할 수밖에 없다.

---
## 03. Phone 다시 살펴보기
- 상속으로 인한 피해를 최소화할 수 있는 방법 찾기

### 추상화에 의존하자
- 자식 클래스가 부모 클래스의 구현이 아닌 추상화에 의존하도록 만드는 것
- 코드 중복을 제거하기 위해 상속을 도입할 때 다르는 두 가지 원칙
  - 두 메서드가 유사하게 보인다면 차이점을 메서드로 추출하라.
  - 부모 클래스의 코드를 하위로 내리지 말고 자식 클래스의 코드를 상위로 올려라. (재사용성과 응집도 측면에서 뛰어나다)

### 차이를 메서드로 추출하라
- 중복 코드 안에서 차이점을 별도의 메서드로 추출
- "변하는 것으로부터 변하지 않는 것을 분리하라" / "변하는 부분을 찾고 이를 캡슐화하라"를 메서드 수준에서 적용
- **calculateCallFee**: call에 대한 통화 요금 계산 메서드를 추출

### 중복 코드를 부모 클래스로 올려라
- 클래스들이 추상화에 의존하도록 만드는 것이기 때문에, 추상 클래스로 구현하는 것이 적합
```java
public abstract class AbstractPhone {}

public class Phone extends AbstractPhone { ... }

public class NightlyDiscountPhone extends AbstractPhone { ... }
```
- Phone과 NightlyDiscountPhone의 공통부분을 부모 클래스로 이동
  - 메서드를 먼저 이동시키는 게 편하다.
  - calculateFee 메서드를 AbstractPhone으로 이동
  - 인스턴스 변수 calls를 AbstractPhone으로 이동
  - calculateCallFee를 추상 메서드로 선언하고, protected로 선언

### 추상화가 핵심이다
- 공통 코드를 이동시킨 후에 각 클래스는 서로 다른 변경의 이유를 가진다.
- 부모 클래스 역시 자신의 내부에 구현된 추상 메서드를 호출하기 때문에 추상화에 의존한다.
- 개방-폐쇄 원칙 준수: 확장에는 열려 있고, 수정에는 닫혀 있다.

### 의도를 드러내는 이름 선택하기
- 이름 변경: Phone은 RegularPhone으로.. AbstractPhone은 phone
```java
public abstract class Phone { ... }

public class RegularPhone extends Phone { ... }

public class NightlyDiscountPhone extends Phone { ... }
```

### 세금 추가하기
- 모든 요금제에 공통으로 적용돼야 하는 요구 사항: 추상 클래스인 phone을 수정
  - 인트턴스 변수 taxRate 추가
  - 변수의 값을 초기화하는 생성자 추가
- RegularPhone과 NightlyDiscountPhone의 생성자도 taxRate를 초기화하도록 수정

---

## 04. 차이에 의한 프로그래밍
- **차이에 의한 프로그래밍 (programming by difference)**: 기존 코드와 다른 부분만을 추가함으로써 애플리케이션의 기능을 확장하는 방법
  - 목표: 중복 코드를 제거하고 코드를 재사용하는 것
    - 중복을 제거하기 위해서 코드를 재사용 가능한 단위로 분해하고 재구성해야 함
