# 생성 디자인 패턴



생성 디자인 패턴이란 **객체의 인스턴스가 생성되는 동안 적용**되는 디자인 패턴을 말한다.

5가지 종류를 알아볼 것이다.

앞서 패턴을 말하기 전에 아래와 같이 **탑재장비(payload)**와 **여러단계(stage)**가 있는 로켓을 제작한다고 생각해보자.

~~~javascript
class Payload {
  weight: number;
}

class Engine {
  thrust: number;
}

class Stage {
  engines: Engine[];
}
~~~



예전 자바스크립트에서 이러한 로켓을 제작하는 접근 방식은 다음과 같았다.

* new 연산자가 있는 생성자 방식

  ~~~javascript
  function Rocket() {
    this.payload = {
      name: 'cargo ship'
    }
    this.stages = [
      {
        engines: [
          // ...
        ]
      }
    ];
  }

  var rocket = new Rocket();
  ~~~

  ​

* factory 함수를 이용한 방식

  ~~~javascript
  function buildRocket() {
    var rocket = {};
    rocket.payload = {
      name: 'cargo ship'
    }
    rocket.stages = [
      {
        engines: [
          // ...
        ]
      }
    ]
    
    return rocket;
  }

  var rocket = buildRocket();
  ~~~



얼핏 보기에는 이 둘은 매우 흡사해 보이지만, 의미론적으로 많은 차이가 있다.

첫 번째에 해당하는 **생성자 접근방식**은 구축 프로세스와 최종 제품간의 강한 연관관계를 암시한다. 

> 여기서 강한 연관관계(strong association)이 무슨말인지 잘 모르겠다.



반면에 두 번째에 해당하는 **팩토리 함수방식**은 해당 제품의 인터페이스를 의미하고 그런 제품을 구축할 수 있는 능력을 요구한다.



하지만 두 가지 구현 모두 특정 요구에 따라 로켓을 모듈식으로 조립할 수 있는 유연성(flexibility)을 제공하지는 못한다. 

이것이 생성 디자인 패턴에서 해결할 내용이다.



우리가 다룰 생성 패턴은 다음과 같다.

- 팩토리 메서드(Factory method): 생성자 대신에 **팩토리의 추상 메서드**를 사용하여 인스턴스를 생성하도록 함으로써 서브클래스는 이러한 메서드를 구현하거나 재정의(override)하여 생성 내용을 변경할 수 있다.
- 추상 팩토리(Abstract factory): **호환 가능한 팩토리**와 해당 제품의 인터페이스를 정의한다. 따라서 전달하는 팩토리를 변경하면 **생성 제품의 군(family)**을 변경할 수 있다.
- 빌더(Builder): 복잡한 객체를 생성하는 **단계**를 정의한다. 그리고 단계의 순서를 변경하거나 **다른 빌더 구현을 사용**하여 생성 내용을 변경한다.
- 프로토타입(Prototype): 파라미터화 된 프로토타입을 복제하여 객체를 생성한다. 따라서 프로토타입을 교체하면 다양한 제품을 생성할 수 있다.
- 싱글톤(Singleton): 하나의 인스턴스만 생성되게 한다.(특정 범위 하에서)



## 팩토리 메서드 패턴

팩토리 메서드는 언제 사용할까?

* 클래스가 어떤 객체를 생성할지 정확하게 예측할 수 없는 경우
* 클래스의 서브클래스가 해당 객체를 더 구체적인 버전으로 생성하기 원하는 경우



위 로켓 생성에 적용할 수 있는 팩토리 메서드 패턴의 구조는 아래와 같다.



팩토리 메서드는 **객체를 생성하는 팩토리의 메서드**다. 

로켓 제작을 예로 들어서 이야기해보자.

팩토리 메서드는 로켓 전체, 혹은 로켓 내 구성요소(component) 하나를 만드는 메서드일 수 이다.

하나의 팩토리 메서드는 대상 객체를 만들기 위해 다른 패고리 메서드에 의존할 수도 있다.

예를 들어, Rocket 클래스 내에 createRocket 메서드가 있다면 이 메서드는 필요한 구성요소를 얻기 위해 createStage와 createPayload와 같은 팩토리 메서드를 호출할 수 있다.

팩토리 메서드 패턴을 사용하면 복잡성 증가가 불가피한 상황에 유연하게 대처할 수 있다.



### 참여 객체

팩토리 메서드 패턴 구현에 참여하는 객체는 다음과 같다.

* 제품(Product): Rocket

  제품으로 생성할 로켓의 **추상 클래스나 인터페이스를 정의**한다.

* 구체적인 제품(Concrete product): FreightRcoket

  특정 로켓 제품을 **구현**한다.

* 생성자(Creator): RocketFactory

  제품 생성 작업을 선정하여 추상화 팩토리 클래스를 정의한다.

* 구체적인 생성자(Concrete creator): FreightRocketFactory

  요구에 맞게 제품을 제작하기 위한 **특정 팩토리 메서드를 구현**하거나 **재정의** 한다.



### 활용 범위

이 패턴은 생성자 구현에서 Rocket을 **분리**하여 팩토리의 **서브클래스가 구축할 내용을 상황에 따라 변경**할 수 있게 한다. 



### 구현 방법

기본 구현으로 중량(weight)이 0인 탑재장비를 운반하는 간단한 1단계 로켓을 제작해보자.

~~~javascript
class RocketFactory {
  buildRocket(): Rocket { }
  createPayload(): Payload { }
  createStages(): Stage[] { }
}
~~~



구성요소 생성부터 시작해보자. 

~~~javascript
createPayload(): Payload {
  return new Payload(0);
}

createStages(): Stage[] {
  const engine = new Engine(1000);
  const stage = new Stage([engine]);
  return [stage];
}
~~~

createPayload의 경우는 간단하게 중량이 0인 탑재장비를 반환한다.

createStages는 하나의 엔진만 갖춘 한 단계를 반환한다.



구성요소를 생성했으니, 조립하는 buildRocket을 만들자.

~~~javascript
buildRocket(): Rocket {
  const rocket = new Rocket();
  const payload = this.createPayload();
  const stages = this.createStages();
  rocket.payload = payload;
  rocket.stages = stages;
  return rocket;
}
~~~



간단하지만 어느 정도 확장성도 갖춘 로켓 팩토리를 만들었다. 이제 이를 바탕으로 인스턴스를 생성해보자. 

~~~javascript
const rocketFactory = new RocketFactory();
const rocket = rocketFactory.buildRocket();
~~~



그럼 다음으로는 **궤도로 인공위성**을 보내는 두 단계의 화물 로켓을 제작해보자. 당연히 단계가 늘어 났고 인공위성도 생겨났기 때문에 추가되는 부분이 있다.



첫째, 아까 1단계 로켓에서는 탑재장비 중량의 초기 값을 0으로 설정했었지만 이번에는 인공위성(satellite)이라는 탑재 장비를 추가하자.

~~~javascript
class Satellite extends Payload {
  constructor(public id: number) {
    super(200);
  }
}
~~~

둘째, 각기 다른 사양을 가진 두 가지 단계를 만들자. 첫 번째에는 4개의 엔진이 있고, 두번째에는 엔진이 한개만 있다.

~~~javascript
class FirstStage extends Stage {
  constructor() {
    super([
      new Engine(1000),
      new Engine(1000),
      new Engine(1000),
      new Engine(1000)
    ]);
  }
}

class SecondStage extends Stage {
  constructor() {
    super([
      new Engine(1000)
    ]);
  }
}
~~~

어떤 형태인지 대충 머리에 그려지는가? 

팩토리를 확장해보자. 

~~~javascript
type FreightRocketStages = [FirstStage, SecondStage];

class FreightRocketFactory extends RocketFactory {
  createPayload(): Setellite { }
  createStages(): FreightRocketStages { }
}
~~~



Satellite에 id 프로퍼티가 추가되었으니 팩토리의 각 인스턴스에 대한 카운터가 필요하다. 이후 고유한 ID로 모든 인공위성을 생성한다.

~~~javascript
nextSatelliteId = 0;

createPayload(): Satellite {
  return new Satellite(this.nextSatelliteId++);
}
~~~



이제 로켓의 첫 번째와 두 번째 단계를 구축하는 createStages 메서드를 구현한다.

~~~javascript
createStages(): FreightRocketStages {
  return [
    new FirstStage(),
    new SecondStage()
  ];
}
~~~

원래 구현이랑 비교하면, 특정 단계를 구축하는 프로세스가 자동적으로 각각 다른 단계의 생성자로 분리된걸 볼 수 있다. 필요하다면 또 다른 생성 패턴을 적용해서 모든 단계를 초기화 할 수 있다. 



### 결론

두가지 로켓의 사례에서 buildRocket은 구축 단계를 처리했다. 그리고 운 좋게도 2번째로 만든 화물 로켓의 구조는 처음에 정의한 로켓의 구조와 동일했다.

근데 항상 이렇게 비슷한 구조라 되는 것은 아니다. 제품(Rocket)의 클래스를 변경하고 싶다면 클래스 이름만 빼고 전체 buildRocket의 모든 내용을 재정의 해야한다. 

이는 매우 번거로운 일이다. 하지만 로켓 인스턴스의 생성을 분리하면 해결할 수 있다.

~~~javascript
buildRocket(): Rocket {
  const rocket = this.createRocket();
  const payload = this.createPayload();
  const stages = this.createStages();
  rocket.payload = payload;
  rocket.stages = stages;
  return rocket;
}

createRocket(): Rocket {
  return new Rocket();
}
~~~

이젠 createRocket 메서드를 **재정의**하면 로켓 클래스를 변경할 수 있게 되었다. 

하지만 서브클래스였던 FreightRocketFactory의 buildRocket의 반환 타입은 FreightRocket이 아니라 여전히 Rocket이다. 

근데 실제로 생성된 건 FreightRocket의 인스턴스이므로 타입을 캐스팅하는 것이 바람직하다.

~~~javascript
const rocket = FreightRocketFactory.buildRocket() as FreightRocket;
~~~

하지만 조금 이상하다.. 이런 타입의 안정성을 위해서 또 다른 수준의 추상화가 필요하다. 

그것이 다음에 배울 **추상 팩토리 패턴**이다.

