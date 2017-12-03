# O.O.P in Javascript

### Chapter 1. A Refresher of Objects

Object 을 최선을 다해 배워야 하는 이유. 최선을 다하여 좋은 코드로 소프트웨어를 만드는 것.

> **everything in this scripting language is an object**
>

Object 를 통한 Paradigm 으로서, **Object-Oriented Programming (OOP)** 을 소개

#####**@ objects 으로 입문하게 될 내용 소개**

- Literal objects 를 만들고 관리하는 방법
- Object constructors 를 정의하는 방법
- Prototype 이란, 그리고 사용하는 방법 is and how to use it
- Class 와 objects, constructors, and prototypes 간의 관계





1. **Literals Notation**


   1. 너도 알고 나도 아는 Object 표현식. 더 이상의 자세한 설명은 생략한다.

   2. ```javascript
      var person = {name: "John", surname: "Smith"}; 

      person.age = 28; 

      function showFullName() { 
        return "John Smith"; 
      } 
       
      person.fullName = showFullName; 
      ```

2. **Constructor**


   1. Object 표현식으로 동일한 구조의 Object 를 노가다로 만드는 대신, constructor 를 사용할 수 있다.

   2. 첫번째 예시는 노가다의 동일한 구조의 Literal Object 

     1. ```javascript
       var johnSmith = {
         name: "John", 
         surname: "Smith", 
         displayFullName = function() { 
          return this.name + " " + this.surname; 
          } 
       }; 

       var marioRossi = {
         name: "Mario", 
         surname: "Rossi", 
         displayFullName = function() { 
          return this.name + " " + this.surname; 
         } 
       }; 
       ```

   3. 두번째 예시는 constructor 를 사용해서 동일한 구조를 쉽게 가져올 수 있다. 


     1. "new" 지시자를 사용해서 표현한다. 

     2. ```javascript
        function Person() { 
          this.name = ""; 
          this.surname = ""; 

          this.displayFullName = function() {...}; 
        } 

        var johnSmith = new Person(); 
        johnSmith.name = "John"; 
        johnSmith.surname = "Smith";   

        var marioRossi = new Person("Mario", "Rossi"); 
        ```

3. **Prototypes**


      1. > `Person()` 을 사용해서 여러개의 object 를 만든 다음에, 
         >
         > 아차 싶어서 나중에 `Person` instance 를 가진 모든 object 가  `greets()` method 를 갖게 하고싶다면 …...

      2. 이것이 JavaSCript 의 OOP 개념 중 가장 중요한 부분이기도 하다. —the **prototype**.

      3. Javascript OOP 에서 prototyping mechanism 은 **상속** 이다.


            1. ```javascript
               Person.prototype.greets = function() { 
                 console.log("Hello " + this.name + " " + this.surname + "!"); 
               }; 
               ```

      4. constructor 를 사용해서 object 를 만들면, 그 object 의 prototype 은 constructor 의 prototype 이 된다.

      5. *(직역하기 귀찮아서.. 설명으로..)* The prototype of an object can in turn have another prototype. In this case, the search for a property or method goes up the prototype chain until you get *object*-the basic prototype of all objects.

4. **Classes**


      1. **ECMAScript 2015** (also known as **ECMAScript 6** or **ES6**) 명세에서 class 를 소개

      2. Java 나 C# 같은 다른 언어에서 class 구조는 object 구조의 추상적인 묘사인 반면,

      3. **Javascript** 에서 class 구조는 (이전에 봐왔던 것처럼) object 만드는 접근방식에 있어 단순하다.


            1. ```javascript
               class Person { 
                 constructor(name, surname) { 
                   this.name = name; 
                   this.surname = surname; 
                 } 
                 
                 method1() { 
                   ... 
                 } 
                
                 method2() { 
                   ... 
                 } 
               } 

               var Person = class { 
                 constructor(name, surname) { 
                   this.name = name; 
                   this.surname = surname; 
                 } 
               }; 
                
               var person = new Person("John", "Smith"); 
               ```

      4. **Class 의 특징** (여러가지가 더 많지만, 내가 정리한 내용만)


            1. Class 에 정의된 모든 method 들은 해당 class 의 prototype property 에 속한다. 
            2. 따라서, Class 를 사용해서 만들어진 새로운 object instance 는 해당 class 의 prototype 속성을 갖게된다.
            3. 보통 method 들은 급격하게 변경되지 않기 때문에, Class prototype 의 method 들로 만들어 사용함으로써 우리가 메모리 관리를 최적화하도록 돕는다.
            4. 왜냐하면 prototype 에 method 를 연결하는 것은, 해당 class 로부터 만들어지는 모든 object 는 해당 method 들의 복사본 하나만을 들고 있는 것이라서 (…직역이 구림…옆 내용이 원본...) Attaching methods to the prototype ensures that we have just one copy of them for all objects created from that class.
            5. 함수는 호이스팅이 되지만, class 는 호이스팅되지 않는다.



#### [피드백] 추가적으로 prototype 개념을 확실하게 알면 좋을거같아요 

- https://developer.mozilla.org/ko/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#프로토타입기반_프로그래밍(Prototype-based_programming)



### 다음 Chapter 는... Diving into OOP Principles

