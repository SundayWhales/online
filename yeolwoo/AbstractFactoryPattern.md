# 추상 팩토리 패턴

추상 팩토리 패턴은 **팩토리 메서드 집합의 인터페이스를 정의**한다.

추상 팩토리 패턴은 전체 팩토리 교체를 통해 **동일한 생산방식**을 따르면서 **서로 다른 제품**을 생산할 수 있게 한다.



팩토리 메서드 패턴과 다르게, 추상 팩토리 패턴에는 **클라이언트**(client)를 별도로 추출하여 구축 프로세스의 흐름을 처리하도록 한다.

이로써 팩토리 부분은 각 구성요소 생산에 더 집중할 수 있게 된다.



### 참여 객체

추상 팩토리 패턴 구현에 참여하는 객체는 다음과 같다.

- 추상 팩토리(Abstract factory): RocketFactory

  > 팩토리의 **산업 표준**(Industrial standard)?을 정의하여 구성요소나 복잡한 제품을 만드는데 필요한 인터페이스를 제공한다
  >

  무슨 말인지 잘은 모르겠고, 팩토리들의 추상화라고만 이해했다.

- 구체적인 팩토리(Concrete factory): ExperimentalRocketFactory

  > 추상 팩토리 정의한 인터페이스를 구현하고 구체적인 제품을 만든다.

  이전에 만들었던 2개의 로켓을 만들어내는 것을 말하는 것 같다. (=팩토리 메서드 패턴의 팩토리 메서드?)

- 추상 제품(Abstract Product): Rocket, Payload, Stage[]

  > 팩토리가 만들 제품의 인터페이스를 정의한다.

  기존에 만들었던 제품들을 추상화 시켜놓는 것 같다.

- 구체적인 제품(Concrete Product): ExperimentalRocket/FreightRocket, ExperimentalPayload/Sateliite 등

  > 구체적인 팩토리가 만들 실제 제품을 나타낸다.

- 클라이언트(Client)

  > 팩토리 전체에 생산 프로세스를 배치한다.



###활용범위 

추상 팩토리 패턴은 다양한 구체적인 팩토리 위에서 추상화를 만든다.

이 패턴의 백미는 전체 제품군을 상호교환이 가능하게 만드는 데 있다. 

가령 UI 구현을 위한 테마의 구성요소가 좋은 예다.



### 구현방법

추상 팩토리 패턴에서는 클라이언트가 전체 제품 구축을 위해 구체적인 팩토리와 상호작용한다. 

하지만 설계 과정에서 **제품의 구체적인 클래스는 클라이언트에서 분리**되며, 클라이언트는 팩토리와 해당 제품이 정확히 무엇언지 파악하는 대신에 **전체적인 형태만 신경** 쓴다.

~~~javascript
class Client {
  buildRocket(factory: RocketFactory): Rocket {
    const rocket = factory.createRocket();
    rocket.payload = factory.createPayload();
    rocket.stages = factory.createStages();
    return rocket;
  }
}
~~~

이렇게 어떤 형태인지만 신경쓰면 된다.



그럼 이제 다른 관련 클래스들을 인터페이스로 단순화하는 작업부터 시작해 보자.

~~~java
interface Payload {
  weight: number;
}

interface Stage {
  engines: Engine[];
}

interface Rocket {
  payload: Payload;
  stages: Stages[];
}
~~~



그리고 추상 팩토리는 다음과 같다.

~~~java
interface RocketFactory {
  createRocket(): Rocket;
  createPayload(): Payload;
  createStages(): Stages[];
}
~~~



여기서 구체적인 로켓 클래스를 나타내는 제네릭 타입 파라미터가 있는 인터페이스가 필요하다.

~~~java
interface RocketFactory<T extends Rocket> {
  createRocket(): T;
  createPayload(): Payload;
  createStages(): Stages[];
}
~~~



그리고 이를 사용하는 클라이언트에서도 업데이트 해준다.

~~~java
class Client {
  buildRocket<T extends Rocket>(factory: RocketFactory): T {
    const rocket = factory.createRocket();
    rocket.payload = factory.createPayload();
    rocket.stages = factory.createStages();
    return rocket;
  }
}
~~~



그리고 구체적인 팩토리는 아래와 같이 만들어주면 된다.

~~~Java
class ExperimentalRocket implements Rocket { }

class ExperimentalRocketFactory implements RocketFactory<ExperimentalRocket> { }
~~~



그럼 어떻게 사용하는지 알아보자.

~~~javascript
const client = new Client();
const factory = new ExperimentalRocketFactory();
const rocket = client.buildRocket(factory);
~~~



좀 더 설명이 필요하지만 Payload나 Satellite을 구현한 것을 기반으로 만들어진 내용은 아래와 같다.

~~~javascript
const client = new Client();

const experimentalRocketFactory = new ExperimentalRocketFactory();
const freightRocketFactory = new FreightRocketFactory();

const experimentalRocket = client.buildRocket(experimentalRocketFactory);

const freightRocket = client.buildRocket(freightRocketFactory);
~~~



### 결론

추상 팩토리 패턴을 사용하면 전체 제품군을 쉽고 부드럽게 변경할 수 있다.

이게 바로 팩토리 수준의 추상화로 얻을 수 있는 직접적인 이점이다. 

다른 이점들도 있지만 동시에 몇 가지 단점도 존재하지만.. 이건 알아봐야한다...



특징이라면.. 추상 팩토리 패턴은 **특정 군의 제품 내에서 더 나은 호환성을 제공**한다.
