# O.O.P in Javascript

### Chapter 2. Mastering JavaScript OOP

이전 chapter 에서 객체 

, 그리고 OOP 큰 갈래인  ``모듈화``,  ``코드 재사용`` 에 관한 내용을 살펴봤어여

오늘 알아볼 내용은 **진한글씨로!!!**

주요 Topics

- OOP 체계의 원리
- 추상적 개념과 모델링에 대한 지원
- **어떻게 JavaScript 가 Aggregation, Association, Composition 을 실행하는지**
- **JavaScript 의 캡슐화 원리**
- **어떻게 JavaScript 가 상속 원리를 지원하는지**
- **다형성 원리에 대한 지원**
- **원래 OOP 와 JavaScript OOP 사이의 차이점**



 현실을 설계하는 것은 특정 목적을 위한 관련 기능들로 객체를 정의하는 것을 포함하는 것 뿐만이 아니다. 또한 "Association, Aggregation, Composition" 와 같은 객체들 사이의 관계 간 정의를 포함한다. 



## Association (연관)

> 2 또는 그 이상의 객체들 간의 관계이고, 그 관계에서 각 객체는 각각 독립적이다. 

```javascript
function Person(name, surname) { 
this.name = name; 
this.surname = surname; 
this.parent = null; 
} 
 
var johnSmith = new Person("John", "Smith"); 
var fredSmith = new Person("Fred", "Smith"); 
 
fredSmith.parent = johnSmith;
```

위의 예시는 Person 사이를 parent-child 로 정의하기 위한 방식이긴 한데, (상속은 아니지만)

fredSmith 가 johnSmith 의 parent 속성으로 할당된 이 형태는, 두 객체 사이의 Association (연관성) 을 만든다. 

이처럼 JavaScript 는 "속성" 을 통한 "객체 참조" 를 사용해서 객체 간 ``Association`` 을 정의한다.



## Aggregation (집합)

> Association 관계는, 그 관계 안에서 한 객체가 다른 객체보다 주요 역할을 갖고 있는 형태

```javascript
var company = { 
    name: "ACME Inc.", 
    employees: [] 
}; 
 
var johnSmith = new Person("John", "Smith"); 
var marioRossi = new Person("Mario", "Rossi"); 
 
company.employees.push(johnSmith); 
company.employees.push(marioRossi); 
```

위에서 보듯이,  ``company`` 의  ``employees`` 집합에 Person 객체들이 추가되는 관계를 보면, 

Person 객체들이 집합에 추가되지만, 그 집합으로부터 각각 독립적인 형태이다.

-  **Key Point 1.** Company 객체가 삭제되더라도 모든 Person 들은 살아있다는 것
-  **Key Point 2.** 그러나 ``company`` 의 실제 의미는 ``employees`` 의 보존여부에 달려있다는 것..!!!!

Aggregation 과 Association 를 헷갈리는건 헷갈릴 수 있고 그닥 중요한 포인트는 아니당. 

두 관계는 느낌적인 느낌 상 동일할지라도, 

<u>객체의 속성 할당이나 첨부</u>가 **개념의 관점차이**에서 볼 때 다른 상황을 나타낸다. Aggregation 은 여러 객체들의 구성으로 객체를 만드는 반면, Association 은 자율적인?자치적인? 객체들을 연관시킨다.

더군다나, JavaScript 는 우리가 객체들을 연관(Associate) 하던 집합(Aggregate) 하던 코드상 통제하거나 뭘 하려는 것도 없다. 그저… Association 과 Aggregation 은 기술적인 것 보다 더 **개념적인 제약**을 발생시킨다.

## Composition

> Aggregation 의 강한 타입 이라는 뜻, 여기서 각 구성 객체는 소유자 없는 독립적인 삶은 없다. 

```javascript
var person = {name: "John", 
              surname: "Smith", 
              address: { 
                street: "123 Duncannon Street", 
                city: "London", 
                country: "United Kingdom" 
              }}; 
```

위와 같이, person 객체에 address 속성이 강하게 결속되어 있다. address 의 생존은 person 생존여부에 강하게 의존되어 있다. 없으면 나도 없다… 이런...



즈아.. 이번에는 OOP 큰 갈래인  ``모듈화``,  ``코드 재사용``  중에서 두번째 필수요소를 살펴본다.

OOP 로서의 JavaScript 는 최소 세가지 원리를 포함한다. - encapsulation, inheritance, polymorphism

## Encapsulation (캡슐화)

> 모든 data(속성) 과 function(메소드) 들을 내부 자세한 내용은 숨긴채, 한 엔티티에 집중시키는 것

즉, 객체를 사용하는데 있어서

무엇이 필요되는지 노출하는 반면, 그걸 실행하는데 복잡한 자세한 것들은 숨긴다는 의미이다.

```javasc
var company = { 
    name: "ACME Inc.", 
    employees: [], 
    sortEmployeesByName: function() {...} 
}; 
```

위의 코드에서처럼, ``company`` 이름의 객체가 있고,

 ``employees`` 리스트와 그 리스트를 정렬하는 메소드 ``sortEmployeesByName`` 이 같이 있다.

우리가 리스트를 정렬하고 싶다면 **sortEmployeesByName()** 메소드를 알아두기만 하면 된다. 

어떻게 동작하는지 자세한 알고리즘은 **몰라도돼** 



내부의 세부내용과 복잡함을 숨기는 두가지 중요 이유들이 있닷:

1. 내부의 복잡함을 이해할 필요 없이 객체를 사용하는 <u>단순화되고 이해할 수 있는 방법</u>을 제공
2. <u>간단한 변경 관리를 위해서</u> 즉, 내부 정렬 알고리즘을 변경해도 employees 를 외부에서 뭘 액션..(이름순으로 주문하는 방식 같은거..) 에는 영향을 미치지 않는다.

그러나, 내부 실행이 접근가능한 속성에 의존되어 있을 때, 영향을 끼칠 수 있기 때문에 캡슐화를 정작 했건만… 그 노력이 좌절될 위기에 처해진다. 

```javascript
company.employees = "this is a joke!"; 
 
company.sortEmployeesByName(); 
```

위 코드를 실행하게 되면, Javascript 의 Dynamic typing (동적으로 타입이 바뀌는 것) 로 인해

리스트를 정렬하는 기능인 sortEmployeesByName 메소드에서 오류가 발생된다.

요 때, 요 걸 피해가는 방법이 있다…………. **관련 속성에 직접 접근하지 못하게 하는 것**

```javascript
function Company(name) { 
    var employees = []; 
 
    this.name = name; 
 
        this.getEmployees = function() {  
            return employees; 
            }; 
    this.addEmployee = function(employee) {  
            employees.push(employee); 
            }; 
    this.sortEmployeesByName = function() { 
            ... 
            }; 
} 
 
var company = new Company("ACME Inc."); 
```

employees 에 접근하려면 getEmployees() 를 써야하고, 추가하려면 addEmployee() 를 써야한다.

물론……. 위와 같이 Company() constructor 의 메소드를 만든 방식이 제일 최선은 아니다. 

더 나은 접근 방법에 대해 <u>Chapter3. Working with Encapsulation and Information Hiding</u> 에서 다룰 예정..!

아무튼, **Data Protection(데이터 보호)** 의 종류는 일반적으로 **Information Hiding (정보 은닉)** 라고 불려지고, 캡슐화와 종종 관련이 있지만, 자율원칙으로 간주되어야 한다.

다시말해, <u>캡슐화 라는 용어에 일치되는 원칙이 아니라는 뜻</u>

Encapsulation (캡슐화) 는 세부내용을 숨기는 것(hiding details)와 관련되는 반면

Information Hiding Principle (정보은닉원칙) 은 객체의 멤버들에게 다른 접근 레벨을 혀용하는 뜻이다 



## Inheritance (상속)

> 상속은 새로운 객체가 기존에 존재하는 한 객체의 속성들을 얻을 수 있다는 뜻

상속이 발생되는 상황은 "일반적인 것, 사실, 객체" 로부터 출발하여 "특수한 객체"를 만드는 데에 관련되어 있다.

```javascript
function Person() { 
this.name = ""; 
this.surname = ""; 
} 

function Programmer() { 
    this.knownLanguage = ""; 
} 
 
Programmer.prototype = new Person(); 

var programmer = new Programmer(); 
```

Javascript 에서 상속을 실행하는 여러 방법이 있는데, 

위와 같이  ``person`` 으로부터 속성들을 상속받은 ``programmer`` 객체가 만들어지는 간단한 접근방법에는 **prototype** 방식이 있다.

요 상속 원리는 기본 베이직 레벨 수준이고, 더 자세한 ES6 Class 사용한 상속은 Chapter4, Inheriting and Creating Mixins 에서 다룰 예정!



## Polymorphism (다형성)

> 여러 데이터 타입을 균일하게 처리하는 기능

다형성 지원은 OOP 의 전반적인 목표를 향한 프로그래밍의 큰 이점이다. 코드 중복을 줄이고 보다 간단하게 작성할 수 있다.

대게, 프로그래밍 언어에서 다형성을 지원하는 가장 공통된 방식은 

- 다른 데이터 타입들로 파라미터를 가져오는 메소드 (overloading - 겹쳐쓰기)
- 사전에 알려지지 않은 generic 타입 관리 (파라미터 관점 다형성)
- Class 가 표현할 수 있는 표현식과 표현식에서 파생된 클래스



### Overloading Polymorphism (겹쳐쓰기 다형성)

컴파일 시기에, 컴파일러는 호출 파라미터의 타입과 메소드의 매개변수 간 일치에 따라서 

어떤 메소드를 호출할지 산출하게 된다. 다음 C# 과 JavaScript 작성 코드를 보자

##### C# 으로 

```c#
public int CountItems(int x) { 
    return x.ToString().Length; 
} 
 
public int CountItems(string x) { 
    return x.Length; 
} 

public int Sum(int x, int y) { 
    return Sum(x, y, 0); 
} 
 
public int Sum(int x, int y, int z) { 
    return x+ y + z; 
} 
```

##### JavaScript 로 

```javascript
function countItems(x) { 
	return x.toString().length; 
} 

function sum(x = 0, y = 0, z = 0) { 
	return x + y + z; 
} 
```

위 예제를 통해 JavaScript 가 강한 타입의 언어보다 더 직접적인 방법으로 overloading 를 지원하는 것을 볼 수 있다. 

> "강한 타입의 언어" 에서는, 
>
> 컴파일 시기에 컴파일러에 의해 정적으로 적절한 메소드를 인식되기 때문에
>
> overloading 이 때론 정적인 다형성(static polymorphism) 으로 불린다. 
>
> 이것은 메소드 겹쳐 쓰기(method overloading) 와 관련되는 
>
> 동적 다형성(dynamic polymorphism) 과 반대된다.



### Parametric Polymorphism (매개 변수 다형성)

**C# 으로** -> 정시 시에는 타입을 정의하지 않고, 객체 생성에서 타입을 지정하기

```c#
public class Stack<T> { 
    private T[] items; 
    private int count; 
    public void Push(T item) { ... } 
    public T Pop() { ... } 
} 

var stack = new Stack<String>(); 
```

**JavaScript 로** 

```javascript
function Stack() 
{ 
 this.stack = []; 
 this.pop = function(){ 
  return this.stack.pop(); 
 } 
 this.push = function(item){ 
  this.stack.push(item); 
 } 
} 
```

Parametric Polymorphism 은 <u>어떤 타입의 파라미터라도 작동하는 메소드</u>를 말한다.

이건 다시 말해, **generics** 로 불리고 많은 언어들이 built-in 메소드로 지원하고 있다.

JavaScript 의 동적 데이터 타입 성격으로 인해, 자연~스럽게 암묵적으로 parametric polymorphism 을 지원하게 된다. (함수의 매개변수 유형이 값이 할당될 때 유형이 설정되서)



### Subtype polymorphism (하위 유형 다형성)

**C# 으로**

```c#
public class Person { 
 public string Name {get; set;} 
 public string SurName {get; set;} 
} 
 
public class Programmer:Person { 
    public String KnownLanguage {get; set;} 
} 
 
public void WriteFullName(Person p) { 
 Console.WriteLine(p.Name + " " + p.SurName);    
} 
 
var a = new Person(); 
a.Name = "John"; 
a.SurName = "Smith"; 
 
var b = new Programmer(); 
b.Name = "Mario"; 
b.SurName = "Rossi"; 
b.KnownLanguage = "C#"; 
 
WriteFullName(a);    //result: John Smith 
WriteFullName(b);    //result: Mario Rossi 
```

**JavaScript 로**

```javascript
function Person() { 
this.name = ""; 
this.surname = ""; 
} 
 
function Programmer() { 
    this.knownLanguage = ""; 
} 
 
Programmer.prototype = new Person(); 
 
function writeFullName(p) { 
    console.log(p.name + " " + p.surname); 
} 
 
var a = new Person(); 
a.name = "John"; 
a.surname = "Smith"; 
 
var b = new Programmer(); 
b.name = "Mario"; 
b.surname = "Rossi"; 
b.knownLanguage = "JavaScript"; 
 
writeFullName(a);    //result: John Smith 
writeFullName(b);    //result: Mario Rossi 
```

Subtype Polymorphism 은 다른 유형의 객체를 고려할 수 있지만, 상속관계를 **일관되게** 처리해야 한다.

개념적 관점으로 볼 때 ``programmer``  또한 ``person`` 이기 때문에 

Subtype Polymorphism 은 현실을 구체적으로 표현하는 데 적합하다.



## JavaScript OOP versus classical OOP

지금까지 OOP 의 기본적인 원리들을 살펴 봤다. 

그러나, JavaScript 가 대부분의 다른 언어와 <u>특정 어떤 기능</u>들이 좀 다르다. 

특히 그것은 clasical OOP 를 실행하는 프로그래밍 언어로 주로 일하는데 사용해온 개발자들에게 좀 걱정을 만들 수 있다는 점….. 

#### 데이터 타입 관리와 객체 생성이 동적인 생태계

1. 런타임에서 객체 구조가 바뀌는 것은 뭔가 상식을 깨트리기 마련...
2. 그리고 class 개념이 classical OOP 와 큰 차이를 갖고 있다.

#### 객체와 클래스의 차이점

##### Classical OOP

: 두 종류의 추상화를 갖고 있다. -> class 그리고 object

1. 객체
   - 실제 세계 엔티티의 추상화
2. 클래스
   - 객체 또는 다른 클래스의 추상화 (다시 말해, 일반화)
   - 클래스는 불변 (런타임에서 속성과 메소드의 추가, 변경, 삭제 안됨)
   - 추상화 수준을 추가하여 보다 자세한 코드로 이어짐 (뭔가 strict 한 코드작성을 의미하는 듯)

=> 결국 classical OOP 에서 객체는 오직 클래스를 인스턴스화 할때만 만들어질 수 있다.

##### JavaScript OOP

: 객체 관리에 좀 다른 접근방법을 갖고 있다. -> 오직 한 종류의 추상화 object

1. 객체
   - 실제 세계 엔티티의 추상화로서 직접적으로 만들어질 수 있고, 다른 객체의 추상화로서도 만들어질 수 있다.
2. 클래스
   - 추상화된 객체의 프로토타입 
   - 객체와 prototype 은 완전히 유연함 
   - 즉각적이고 컴팩트한 코드를 필요로 함 (유연하고 동적이어서 짧고 간단한 코드작성을 해야한다는 의미…같음)

물론, 클래스 개념이 없으면 상속 개념에 혼선이 올 수 있다. 사실, classical OOP 상속은 클래스에서 허용되는 연산인 반면, prototypcal OOP 상속은 객체에 대한 연산일 뿐이다.



