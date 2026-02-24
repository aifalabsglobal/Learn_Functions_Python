"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/CodeBlock";
import { Menu, X, ArrowRight, BookOpen, Code, Lightbulb, Layers, Zap, ChevronUp } from "lucide-react";

const navLinks = [
  { label: "Contents", href: "#toc" },
  { label: "Data types", href: "#datatypes" },
  { label: "Collections", href: "#collections" },
  { label: "Operators", href: "#operators" },
  { label: "Conditions", href: "#conditions" },
  { label: "Loops", href: "#loops" },
  { label: "Functions", href: "#functions" },
  { label: "OOP", href: "#oop" },
  { label: "Summary", href: "#summary" },
];

const functionTypes = [
  {
    id: "built-in",
    title: "Built-in Functions",
    emoji: "🛠️",
    description: "Pre-made tools that come with Python, ready to use.",
    explanation: "Python ships with dozens of built-in functions. You don't install anything — they're always available. Use them for I/O (print, input), math (abs, round, min, max, sum), type checking (type, isinstance), working with collections (len, sorted, reversed, enumerate, zip), and more. They're optimized and well-tested, so prefer them over writing your own when they fit.",
    kidExplanation: "Like tools in a toolbox that comes with your house. print(), len(), max() are ready whenever you need them.",
    examples: [
      { title: "Output and collection size", code: `# Display text and get collection length\nprint("Hello!")                    # Hello!\nitems = ["apple", "banana", "cherry"]\nprint(len(items))                 # 3\nprint(len("python"))              # 6` },
      { title: "Math and aggregation", code: `# Min, max, sum — no loops needed\nscores = [85, 92, 78, 95, 88]\nprint(min(scores))                # 78\nprint(max(scores))                # 95\nprint(sum(scores))                # 438\nprint(round(3.14159, 2))          # 3.14\nprint(abs(-10))                   # 10` },
      { title: "Type and conversion", code: `# Inspect types and convert between them\nx = 42\nprint(type(x))                    # <class 'int'>\nprint(isinstance(x, int))         # True\nprint(str(42))                    # "42"\nprint(int("100"))                # 100\nprint(list("hi"))                 # ['h', 'i']` },
      { title: "Sorting, enumerating, zipping", code: `# Sort and iterate with index or multiple lists\nnames = ["Zoe", "Alice", "Bob"]\nprint(sorted(names))              # ['Alice', 'Bob', 'Zoe']\nfor i, name in enumerate(names):\n    print(i, name)                 # 0 Zoe, 1 Alice, 2 Bob\nids = [1, 2, 3]\nfor id, name in zip(ids, names):\n    print(id, name)                # 1 Zoe, 2 Alice, 3 Bob` },
    ],
  },
  {
    id: "user-defined",
    title: "User-defined Functions",
    emoji: "✨",
    description: "Functions you create yourself to structure and reuse logic.",
    explanation: "You define them with def. They can take no arguments or many, have default values, return one value or many (as a tuple), and include docstrings. Use them to avoid repeating code, to name a logical step, and to make programs easier to read and test. They're the main way you organize behavior in Python.",
    kidExplanation: "Your own recipe: you decide inputs, steps, and output. Write once, use again and again.",
    examples: [
      { title: "Basic function with parameters and return", code: `def greet(name):\n    """Return a greeting string."""\n    return f"Hello, {name}!"\n\nprint(greet("Alex"))               # Hello, Alex!` },
      { title: "Default arguments and multiple returns", code: `def describe(thing, uppercase=False):\n    text = f"It is: {thing}"\n    return text.upper() if uppercase else text\n\nprint(describe("a box"))         # It is: a box\nprint(describe("a box", True))   # IT IS: A BOX\n\ndef min_max(nums):\n    return min(nums), max(nums)\nlo, hi = min_max([3, 1, 4, 1, 5])\nprint(lo, hi)                     # 1 5` },
      { title: "Variable-length args: *args and **kwargs", code: `def sum_all(*numbers):\n    return sum(numbers)\nprint(sum_all(1, 2, 3, 4))        # 10\n\ndef make_profile(**info):\n    return info\nprint(make_profile(name="Sam", age=20))  # {'name': 'Sam', 'age': 20}` },
      { title: "Reusable validation and formatting", code: `def is_valid_email(s):\n    return "@" in s and "." in s and len(s) > 5\n\ndef format_price(amount):\n    return f"\${amount:.2f}"\n\nprint(is_valid_email("a@b.co"))   # True\nprint(format_price(19.5))         # $19.50` },
    ],
  },
  {
    id: "lambda",
    title: "Lambda Functions",
    emoji: "⚡",
    description: "Anonymous one-line functions for simple expressions.",
    explanation: "A lambda is a small function defined with a single expression. It can only contain that expression (no statements, no docstring). Use lambdas where you need a short callback: sorting (key=), map, filter, or passing a quick transformation. For anything longer or clearer with a name, use a normal def instead.",
    kidExplanation: "A quick note instead of a full letter. Perfect for simple one-line jobs.",
    examples: [
      { title: "Basic lambda: assign or pass inline", code: `square = lambda x: x ** 2\nadd = lambda a, b: a + b\nprint(square(5))                   # 25\nprint(add(3, 7))                 # 10` },
      { title: "Sorting with a key", code: `# Sort by length, then by last letter\nwords = ["apple", "pie", "banana", "cat"]\nby_length = sorted(words, key=lambda w: len(w))\nprint(by_length)                 # ['pie', 'cat', 'apple', 'banana']\nby_last = sorted(words, key=lambda w: w[-1])\nprint(by_last)                   # ['apple', 'pie', 'banana', 'cat']` },
      { title: "map and filter with lambda", code: `nums = [1, 2, 3, 4, 5]\ndoubled = list(map(lambda x: x * 2, nums))\nprint(doubled)                   # [2, 4, 6, 8, 10]\nevens = list(filter(lambda x: x % 2 == 0, nums))\nprint(evens)                    # [2, 4]` },
      { title: "Conditional expression in lambda", code: `# One-line if/else\nclassify = lambda n: "even" if n % 2 == 0 else "odd"\nprint(classify(4))               # even\nprint(classify(7))               # odd` },
    ],
  },
  {
    id: "recursive",
    title: "Recursive Functions",
    emoji: "🔄",
    description: "Functions that call themselves with a smaller problem until a base case.",
    explanation: "Recursion means the function calls itself. You must have a base case (when to stop) and a recursive case (call with a smaller or simpler input). Good for problems that are naturally self-similar: tree/graph traversal, factorials, Fibonacci, divide-and-conquer. Watch out for deep recursion (stack overflow) and consider iteration or tail recursion where it matters.",
    kidExplanation: "Like climbing stairs: take one step, then ask yourself to climb the rest until you reach the top.",
    examples: [
      { title: "Factorial", code: `def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nprint(factorial(5))              # 120  (5*4*3*2*1)` },
      { title: "Sum of a list recursively", code: `def sum_list(nums):\n    if not nums:\n        return 0\n    return nums[0] + sum_list(nums[1:])\n\nprint(sum_list([1, 2, 3, 4, 5])) # 15` },
      { title: "Countdown and tree-like thinking", code: `def countdown(n):\n    if n <= 0:\n        print("Go!")\n        return\n    print(n)\n    countdown(n - 1)\n\ncountdown(3)  # 3, 2, 1, Go!` },
      { title: "Fibonacci (nth number)", code: `def fib(n):\n    if n <= 0:\n        return 0\n    if n == 1:\n        return 1\n    return fib(n - 1) + fib(n - 2)\n\nprint([fib(i) for i in range(10)])  # [0,1,1,2,3,5,8,13,21,34]` },
    ],
  },
  {
    id: "higher-order",
    title: "Higher-Order Functions",
    emoji: "🎯",
    description: "Functions that take other functions as arguments or return functions.",
    explanation: "Higher-order functions treat functions as values. They might apply a function to every element (map), keep only elements that pass a test (filter), or combine a sequence into one value (reduce). You can also write functions that return new functions (e.g. decorators or factories). This style keeps code flexible and avoids duplication.",
    kidExplanation: "Managers that tell other functions what to do. They can receive or create functions.",
    examples: [
      { title: "map, filter, and a custom apply", code: `nums = [1, 2, 3, 4, 5]\ndoubled = list(map(lambda x: x * 2, nums))\nevens = list(filter(lambda x: x % 2 == 0, nums))\nprint(doubled)                   # [2, 4, 6, 8, 10]\nprint(evens)                    # [2, 4]\n\nfrom functools import reduce\nproduct = reduce(lambda a, b: a * b, nums)\nprint(product)                  # 120` },
      { title: "Function that takes a function", code: `def apply_twice(f, x):\n    return f(f(x))\n\ndouble = lambda x: x * 2\nprint(apply_twice(double, 5))    # 20  (5 -> 10 -> 20)` },
      { title: "Function that returns a function (factory)", code: `def make_multiplier(n):\n    def mul(x):\n        return x * n\n    return mul\n\ndouble = make_multiplier(2)\ntriple = make_multiplier(3)\nprint(double(5))                 # 10\nprint(triple(5))                 # 15` },
      { title: "sorted with key function", code: `students = [("Alice", 85), ("Bob", 92), ("Charlie", 78)]\nby_score = sorted(students, key=lambda s: s[1], reverse=True)\nprint(by_score)  # [('Bob', 92), ('Alice', 85), ('Charlie', 78)]` },
    ],
  },
  {
    id: "generator",
    title: "Generator Functions",
    emoji: "🔋",
    description: "Functions that yield values one at a time; they're lazy and memory-efficient.",
    explanation: "A generator function uses yield instead of return. Each yield produces one value and pauses; when you ask for the next value, it resumes. So you don't build a huge list in memory — you stream items. Use generators for large or infinite sequences, pipelines, or when you might stop early (e.g. search).",
    kidExplanation: "A bag that gives one candy at a time instead of dumping all. Great for big data.",
    examples: [
      { title: "Basic yield and iteration", code: `def count_up_to(n):\n    for i in range(n):\n        yield i\n\nfor x in count_up_to(3):\n    print(x)                      # 0, 1, 2` },
      { title: "Infinite sequence (no list in memory)", code: `def natural_numbers():\n    n = 0\n    while True:\n        yield n\n        n += 1\n\ngen = natural_numbers()\nprint(next(gen), next(gen), next(gen))  # 0 1 2` },
      { title: "Fibonacci as a generator", code: `def fib_gen(n):\n    a, b = 0, 1\n    for _ in range(n):\n        yield a\n        a, b = b, a + b\n\nprint(list(fib_gen(8)))          # [0, 1, 1, 2, 3, 5, 8, 13]` },
      { title: "Reading large file line by line", code: `def read_lines(path):\n    with open(path) as f:\n        for line in f:\n            yield line.strip()\n\n# Use: for line in read_lines("big.txt"): ...` },
    ],
  },
  {
    id: "nested",
    title: "Nested Functions",
    emoji: "📦",
    description: "Functions defined inside another function; they're only visible there.",
    explanation: "You can put a def inside another def. The inner function can read the outer function's variables (closure). Use nested functions to hide helpers that only one outer function needs, or to build a function that returns another function (e.g. a configured callback).",
    kidExplanation: "Like nesting dolls: a function inside another. The inner one is hidden from the outside.",
    examples: [
      { title: "Inner function using outer variable", code: `def outer(msg):\n    def inner():\n        print(msg)\n    inner()\n\nouter("Hi!")                     # Hi!` },
      { title: "Helper only used inside one function", code: `def process(items):\n    def clean(s):\n        return s.strip().lower()\n    return [clean(x) for x in items]\n\nprint(process(["  HELLO  ", "  World  "]))  # ['hello', 'world']` },
      { title: "Returning the inner function", code: `def make_greeter(greeting):\n    def greet(name):\n        return f"{greeting}, {name}!"\n    return greet\n\nsay_hi = make_greeter("Hello")\nprint(say_hi("Alex"))            # Hello, Alex!` },
      { title: "Validation helpers inside one function", code: `def register(username, age):\n    def valid_name(s):\n        return len(s) >= 3 and s.isalpha()\n    def valid_age(a):\n        return 0 < a < 150\n    if not valid_name(username):\n        return "Invalid name"\n    if not valid_age(age):\n        return "Invalid age"\n    return "OK"\n\nprint(register("Ab", 25))       # Invalid name\nprint(register("Alice", 25))   # OK` },
    ],
  },
  {
    id: "closure",
    title: "Closure Functions",
    emoji: "🔐",
    description: "Inner functions that \"remember\" variables from the outer scope after it has finished.",
    explanation: "A closure is an inner function that captures variables from its enclosing function. When the outer function returns the inner function, that inner function still has access to those variables. Use closures for stateful callbacks, counters, configuration (e.g. greeters with a fixed greeting), or to encapsulate private state without classes.",
    kidExplanation: "A backpack the function carries: it remembers variables even after the outer function finishes.",
    examples: [
      { title: "Counter that remembers state", code: `def make_counter():\n    count = 0\n    def inc():\n        nonlocal count\n        count += 1\n        return count\n    return inc\n\nc = make_counter()\nprint(c(), c(), c())              # 1 2 3` },
      { title: "Configurable greeter", code: `def make_greeter(greeting, punctuation="!"):\n    def greet(name):\n        return f"{greeting}, {name}{punctuation}"\n    return greet\n\nhello = make_greeter("Hello")\nprint(hello("Sam"))               # Hello, Sam!` },
      { title: "Private state (no one else can change it)", code: `def make_bank_account(initial=0):\n    balance = initial\n    def deposit(amount):\n        nonlocal balance\n        balance += amount\n        return balance\n    def get_balance():\n        return balance\n    return deposit, get_balance\n\ndep, get = make_bank_account(100)\ndep(50)\nprint(get())                    # 150` },
      { title: "Event handler with captured config", code: `def make_click_handler(button_id):\n    count = 0\n    def on_click():\n        nonlocal count\n        count += 1\n        print(f"Button {button_id} clicked {count} times")\n    return on_click\n\nhandler = make_click_handler("submit")\nhandler()  # Button submit clicked 1 times\nhandler()  # Button submit clicked 2 times` },
    ],
  },
  {
    id: "methods",
    title: "Methods (Class Functions)",
    emoji: "👥",
    description: "Functions defined on a class; they operate on the instance (self) or the class.",
    explanation: "Methods are functions attached to a class. Instance methods take self and work on one object; class methods take cls and work on the class; static methods take neither. Use them to encapsulate behavior that belongs to an object (e.g. .save(), .validate()) or to the class (e.g. factory methods).",
    kidExplanation: "Special abilities of objects. A dog has bark() and fetch(). They know which object they belong to.",
    examples: [
      { title: "Instance methods (self)", code: `class Dog:\n    def __init__(self, name):\n        self.name = name\n    def bark(self):\n        return f"{self.name} says Woof!"\n    def sit(self):\n        return f"{self.name} is sitting."\n\nbuddy = Dog("Buddy")\nprint(buddy.bark())               # Buddy says Woof!\nprint(buddy.sit())               # Buddy is sitting.` },
      { title: "Class method and static method", code: `class Calculator:\n    count = 0\n    def add(self, a, b):\n        Calculator.count += 1\n        return a + b\n    @classmethod\n    def get_count(cls):\n        return cls.count\n    @staticmethod\n    def multiply(a, b):\n        return a * b\n\nc = Calculator()\nc.add(2, 3)\nprint(Calculator.get_count())   # 1\nprint(Calculator.multiply(4, 5)) # 20` },
      { title: "String and list methods (built-in)", code: `s = "  Hello World  "\nprint(s.strip())                 # "Hello World"\nprint(s.upper())                 # "  HELLO WORLD  "\nprint(s.split())                 # ['Hello', 'World']\n\nnums = [3, 1, 4, 1, 5]\nnums.append(9)\nnums.sort()\nprint(nums)                      # [1, 1, 3, 4, 5, 9]` },
      { title: "Chaining and encapsulation", code: `class Counter:\n    def __init__(self):\n        self.value = 0\n    def inc(self):\n        self.value += 1\n        return self  # allow chaining\n    def get(self):\n        return self.value\n\nc = Counter()\nc.inc().inc().inc()\nprint(c.get())                   # 3` },
    ],
  },
  {
    id: "async",
    title: "Async Functions",
    emoji: "⏱️",
    description: "Coroutines that can pause (await) without blocking the whole program.",
    explanation: "Async functions are defined with async def and use await inside them. They don't run until you schedule them (e.g. with asyncio.run or by awaiting them). Use them for I/O-bound work (network, files, databases) so that while one task waits, others can run. You need an event loop (asyncio) to run them.",
    kidExplanation: "A chef who starts several dishes at once. While water boils, they chop. No need to wait for one thing to finish.",
    examples: [
      { title: "Basic async and await", code: `import asyncio\n\nasync def say_hi(name):\n    await asyncio.sleep(0.5)\n    print(f"Hi, {name}!")\n\nasync def main():\n    await say_hi("Alice")\n\nasyncio.run(main())             # Hi, Alice!` },
      { title: "Run several async tasks concurrently", code: `import asyncio\n\nasync def fetch(id, delay):\n    await asyncio.sleep(delay)\n    return f"Result-{id}"\n\nasync def main():\n    results = await asyncio.gather(\n        fetch(1, 0.3),\n        fetch(2, 0.1),\n        fetch(3, 0.2)\n    )\n    print(results)  # ['Result-1', 'Result-2', 'Result-3']\n\nasyncio.run(main())` },
      { title: "Async for I/O (simulated)", code: `import asyncio\n\nasync def read_data(source):\n    await asyncio.sleep(0.2)  # simulate network delay\n    return f"Data from {source}"\n\nasync def main():\n    a = asyncio.create_task(read_data("A"))\n    b = asyncio.create_task(read_data("B"))\n    print(await a, await b)\n\nasyncio.run(main())` },
      { title: "Sequential vs concurrent timing", code: `import asyncio\nimport time\n\nasync def slow_task(name, sec):\n    await asyncio.sleep(sec)\n    return name\n\nasync def concurrent():\n    start = time.perf_counter()\n    await asyncio.gather(slow_task("A", 0.5), slow_task("B", 0.5))\n    print(f"Concurrent: {time.perf_counter() - start:.2f}s")  # ~0.5s\n\nasyncio.run(concurrent())` },
    ],
  },
];

const oopTopics = [
  {
    id: "oop-class-basics",
    title: "Classes and instances",
    emoji: "🏗️",
    description: "Define a class and create instances with __init__ and self.",
    explanation: "A class is a blueprint; an instance is one concrete object. Use __init__(self, ...) to set up each instance. self is the instance itself. Attributes set on self belong to that instance.",
    kidExplanation: "A class is like a cookie cutter; each instance is one cookie. __init__ is where you set each cookie's flavor and size.",
    examples: [
      { title: "Simple class and __init__", code: `class Dog:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\nbuddy = Dog("Buddy", 3)\nprint(buddy.name, buddy.age)   # Buddy 3` },
      { title: "Multiple instances", code: `class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\np1 = Point(1, 2)\np2 = Point(10, 20)\nprint(p1.x, p2.y)              # 1 20` },
      { title: "Default arguments in __init__", code: `class User:\n    def __init__(self, name, role="user"):\n        self.name = name\n        self.role = role\n\nu = User("Alice")\nprint(u.role)                  # user\nadmin = User("Bob", "admin")\nprint(admin.role)             # admin` },
    ],
  },
  {
    id: "oop-instance-vs-class-attrs",
    title: "Instance vs class attributes",
    emoji: "📌",
    description: "Instance attributes are per object; class attributes are shared by all instances.",
    explanation: "Attributes assigned on self in __init__ or in methods are instance attributes. Variables assigned at class level (outside methods) are class attributes — shared and often used for constants or counters.",
    kidExplanation: "Instance = your own backpack. Class attribute = a shared whiteboard everyone can see.",
    examples: [
      { title: "Class attribute shared by all", code: `class Robot:\n    count = 0  # class attribute\n    def __init__(self, name):\n        self.name = name      # instance attribute\n        Robot.count += 1\n\nr1 = Robot("R1")\nr2 = Robot("R2")\nprint(Robot.count)            # 2\nprint(r1.name, r2.name)      # R1 R2` },
      { title: "Constant as class attribute", code: `class Circle:\n    PI = 3.14159\n    def __init__(self, radius):\n        self.radius = radius\n    def area(self):\n        return Circle.PI * self.radius ** 2\n\nc = Circle(5)\nprint(c.area())               # 78.53975` },
    ],
  },
  {
    id: "oop-instance-methods",
    title: "Instance methods (self)",
    emoji: "🎯",
    description: "Methods that operate on the instance; first parameter is self.",
    explanation: "Instance methods take self as the first argument and use it to read or change instance state. Call them as obj.method(args); Python passes obj as self.",
    kidExplanation: "Actions only that object can do, like a dog barking — each dog barks with its own voice.",
    examples: [
      { title: "Methods using self", code: `class BankAccount:\n    def __init__(self, balance=0):\n        self.balance = balance\n    def deposit(self, amount):\n        self.balance += amount\n        return self.balance\n    def withdraw(self, amount):\n        if amount <= self.balance:\n            self.balance -= amount\n        return self.balance\n\nacc = BankAccount(100)\nacc.deposit(50)\nprint(acc.balance)             # 150` },
      { title: "Method calling another method", code: `class Counter:\n    def __init__(self):\n        self.n = 0\n    def inc(self):\n        self.n += 1\n    def inc_by(self, k):\n        for _ in range(k):\n            self.inc()\n        return self.n\n\nc = Counter()\nc.inc_by(3)\nprint(c.n)                    # 3` },
    ],
  },
  {
    id: "oop-classmethod-staticmethod",
    title: "@classmethod and @staticmethod",
    emoji: "⚙️",
    description: "classmethod gets the class (cls); staticmethod gets neither self nor cls.",
    explanation: "Use @classmethod when the method needs the class (e.g. alternative constructors like from_string). Use @staticmethod for helpers that don't need self or cls. Both are called on the class or on an instance.",
    kidExplanation: "Class method = factory that knows the blueprint. Static method = a tool that doesn't need any specific object.",
    examples: [
      { title: "classmethod: alternative constructor", code: `class Date:\n    def __init__(self, y, m, d):\n        self.y, self.m, self.d = y, m, d\n    @classmethod\n    def from_string(cls, s):\n        y, m, d = map(int, s.split("-"))\n        return cls(y, m, d)\n\nd = Date.from_string("2025-02-24")\nprint(d.y, d.m, d.d)          # 2025 2 24` },
      { title: "staticmethod: utility", code: `class Math:\n    @staticmethod\n    def is_even(n):\n        return n % 2 == 0\n    @staticmethod\n    def add(a, b):\n        return a + b\n\nprint(Math.is_even(4))        # True\nprint(Math.add(3, 5))         # 8` },
    ],
  },
  {
    id: "oop-property",
    title: "@property (getters and setters)",
    emoji: "🔒",
    description: "Expose attributes with computed or validated access using @property and @name.setter.",
    explanation: "Use @property to make a method callable as obj.attr (no parentheses). Use @attr.setter to run code when someone assigns to obj.attr. Good for validation, computed values, or hiding internal storage.",
    kidExplanation: "Like a vending machine: you press a button (property) and get something — maybe it's computed or checked before giving it.",
    examples: [
      { title: "Computed property", code: `class Rectangle:\n    def __init__(self, w, h):\n        self.width = w\n        self.height = h\n    @property\n    def area(self):\n        return self.width * self.height\n\nr = Rectangle(4, 5)\nprint(r.area)                 # 20  (no parentheses)` },
      { title: "Property with setter validation", code: `class Temperature:\n    def __init__(self, celsius=0):\n        self._c = celsius\n    @property\n    def celsius(self):\n        return self._c\n    @celsius.setter\n    def celsius(self, v):\n        if not -273.15 <= v <= 1e6:\n            raise ValueError("Invalid")\n        self._c = v\n\nt = Temperature(25)\nt.celsius = 30\nprint(t.celsius)              # 30` },
    ],
  },
  {
    id: "oop-private-mangling",
    title: "Private and name mangling (_ and __)",
    emoji: "🔐",
    description: "Single underscore = convention for internal; double = name mangling to avoid subclass clashes.",
    explanation: "A leading underscore (_attr) is a convention meaning 'internal use'. Double underscore (__attr) triggers name mangling: Python renames it to _ClassName__attr so subclasses don't accidentally override it. Not true privacy — still accessible if you know the name.",
    kidExplanation: "Underscore = 'please don't touch'. Double underscore = Python renames it so subclasses don't mix it up.",
    examples: [
      { title: "Single underscore convention", code: `class Wallet:\n    def __init__(self):\n        self._balance = 0   # "internal"\n    def add(self, n):\n        self._balance += n\n    def get_balance(self):\n        return self._balance\n\nw = Wallet()\nw.add(10)\nprint(w.get_balance())       # 10\n# w._balance still accessible; convention only` },
      { title: "Name mangling with __", code: `class Parent:\n    def __init__(self):\n        self.__secret = 42\n\nclass Child(Parent):\n    def get_secret(self):\n        return self._Parent__secret  # mangled name\n\nc = Child()\nprint(c.get_secret())         # 42` },
    ],
  },
  {
    id: "oop-inheritance",
    title: "Inheritance and super()",
    emoji: "🧬",
    description: "Subclass inherits from a parent; use super() to call the parent's methods.",
    explanation: "Define class Child(Parent): to inherit. Override methods by redefining them. Use super().method() or super().__init__(...) to call the parent's implementation. Keeps code DRY and models 'is-a' relationships.",
    kidExplanation: "Child class is like a copy of the parent that you can change. super() means 'ask my parent to do this first'.",
    examples: [
      { title: "Basic inheritance", code: `class Animal:\n    def speak(self):\n        return "..."\n\nclass Dog(Animal):\n    def speak(self):\n        return "Woof!"\n\nclass Cat(Animal):\n    def speak(self):\n        return "Meow!"\n\nd = Dog()\nprint(d.speak())              # Woof!` },
      { title: "super() in __init__", code: `class Person:\n    def __init__(self, name):\n        self.name = name\n\nclass Student(Person):\n    def __init__(self, name, student_id):\n        super().__init__(name)\n        self.student_id = student_id\n\ns = Student("Alice", "S001")\nprint(s.name, s.student_id)   # Alice S001` },
      { title: "super() in overridden method", code: `class Logger:\n    def log(self, msg):\n        print("Log:", msg)\n\nclass TimedLogger(Logger):\n    def log(self, msg):\n        import time\n        super().log(f"[{time.time():.0f}] {msg}")\n\nl = TimedLogger()\nl.log("hello")                 # Log: [timestamp] hello` },
    ],
  },
  {
    id: "oop-multiple-inheritance",
    title: "Multiple inheritance and MRO",
    emoji: "🔀",
    description: "A class can inherit from multiple parents; MRO (method resolution order) decides which method runs.",
    explanation: "class C(A, B): means C inherits from both A and B. Python uses the MRO (C3 linearization) to order base classes. Use super() in multiple inheritance so all parents get a chance; avoid diamond problems by designing carefully.",
    kidExplanation: "You can have two parents; Python has a rule (MRO) for which parent's version to use first.",
    examples: [
      { title: "Multiple bases", code: `class Flyer:\n    def fly(self):\n        return "Flying"\n\nclass Swimmer:\n    def swim(self):\n        return "Swimming"\n\nclass Duck(Flyer, Swimmer):\n    pass\n\nd = Duck()\nprint(d.fly(), d.swim())      # Flying Swimming` },
      { title: "MRO order", code: `class A:\n    def go(self):\n        return "A"\nclass B(A):\n    def go(self):\n        return "B"\nclass C(A):\n    def go(self):\n        return "C"\nclass D(B, C):\n    pass\n\nprint(D().go())               # B  (B before C in MRO)\nprint(D.mro())                # [D, B, C, A, object]` },
    ],
  },
  {
    id: "oop-abstract",
    title: "Abstract base classes (ABC)",
    emoji: "📐",
    description: "Define a contract with @abstractmethod; subclasses must implement those methods.",
    explanation: "Inherit from ABC and mark methods with @abstractmethod. You can't instantiate the base class; subclasses must implement all abstract methods. Use for interfaces or shared contracts.",
    kidExplanation: "A template that says 'you must have these actions' but doesn't say how — each subclass fills in the how.",
    examples: [
      { title: "ABC and abstractmethod", code: `from abc import ABC, abstractmethod\n\nclass Shape(ABC):\n    @abstractmethod\n    def area(self):\n        pass\n\nclass Rectangle(Shape):\n    def __init__(self, w, h):\n        self.w, self.h = w, h\n    def area(self):\n        return self.w * self.h\n\n# Shape()  # TypeError: can't instantiate\nr = Rectangle(3, 4)\nprint(r.area())                # 12` },
      { title: "Multiple abstract methods", code: `from abc import ABC, abstractmethod\n\nclass Animal(ABC):\n    @abstractmethod\n    def speak(self):\n        pass\n    @abstractmethod\n    def move(self):\n        pass\n\nclass Dog(Animal):\n    def speak(self):\n        return "Woof"\n    def move(self):\n        return "Run"\n\nd = Dog()\nprint(d.speak(), d.move())    # Woof Run` },
    ],
  },
  {
    id: "oop-magic-methods",
    title: "Magic (dunder) methods",
    emoji: "✨",
    description: "__str__, __repr__, __eq__, __len__, __getitem__, and more customize built-in behavior.",
    explanation: "Double-underscore methods hook into language features: __init__, __str__ (for print), __repr__ (for repr), __eq__ (==), __len__ (len()), __getitem__ (indexing), __enter__/__exit__ (with). Implement them to make your objects behave like built-ins.",
    kidExplanation: "Secret handshakes: when Python does str(obj) or len(obj), it looks for __str__ or __len__ on your object.",
    examples: [
      { title: "__str__ and __repr__", code: `class Point:\n    def __init__(self, x, y):\n        self.x, self.y = x, y\n    def __str__(self):\n        return f"Point({self.x}, {self.y})"\n    def __repr__(self):\n        return f"Point({self.x!r}, {self.y!r})"\n\np = Point(1, 2)\nprint(p)                      # Point(1, 2)\nprint(repr(p))                # Point(1, 2)` },
      { title: "__eq__ and __len__", code: `class Card:\n    def __init__(self, rank, suit):\n        self.rank, self.suit = rank, suit\n    def __eq__(self, other):\n        if not isinstance(other, Card):\n            return False\n        return self.rank == other.rank and self.suit == other.suit\n    def __len__(self):\n        return 2\n\nc1 = Card("A", "spades")\nc2 = Card("A", "spades")\nprint(c1 == c2)               # True\nprint(len(c1))               # 2` },
      { title: "__getitem__ for indexing", code: `class Dice:\n    def __init__(self, values):\n        self.values = list(values)\n    def __getitem__(self, i):\n        return self.values[i]\n    def __len__(self):\n        return len(self.values)\n\nd = Dice([1, 2, 3, 4, 5, 6])\nprint(d[0], d[-1])            # 1 6` },
    ],
  },
  {
    id: "oop-composition",
    title: "Composition vs inheritance",
    emoji: "🧩",
    description: "Favor 'has-a' (composition) over 'is-a' (inheritance) when modeling behavior.",
    explanation: "Inheritance: B is a kind of A. Composition: B has an A. Prefer composition when you're reusing behavior without a strict is-a relationship, or when you want to swap parts. Use inheritance when subclasses truly are a subtype of the base.",
    kidExplanation: "Inheritance = 'I am a type of that.' Composition = 'I have one of those inside me.'",
    examples: [
      { title: "Composition: has-a", code: `class Engine:\n    def start(self):\n        return "Engine on"\n\nclass Car:\n    def __init__(self):\n        self.engine = Engine()  # has-a\n    def start(self):\n        return self.engine.start()\n\ncar = Car()\nprint(car.start())             # Engine on` },
      { title: "When to use which", code: `# Inheritance: Dog *is a* Animal\nclass Animal: pass\nclass Dog(Animal): pass\n\n# Composition: Car *has an* Engine\nclass Engine: pass\nclass Car:\n    def __init__(self):\n        self.engine = Engine()` },
    ],
  },
  {
    id: "oop-dataclass",
    title: "dataclasses",
    emoji: "📦",
    description: "Use @dataclass for classes that mainly hold data; auto __init__, __repr__, and more.",
    explanation: "from dataclasses import dataclass. Declare class attributes with type annotations; you get __init__, __repr__, __eq__ by default. Use frozen=True for immutability. Reduces boilerplate for data-holding classes.",
    kidExplanation: "A shortcut for classes that are mostly 'these fields' — Python writes the boring stuff for you.",
    examples: [
      { title: "Basic dataclass", code: `from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n\np = Point(1, 2)\nprint(p)                      # Point(x=1, y=2)\nprint(p.x + p.y)              # 3` },
      { title: "Default values and frozen", code: `from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Config:\n    host: str = "localhost"\n    port: int = 8080\n\nc = Config()\nprint(c.host, c.port)         # localhost 8080\n# c.port = 90  # FrozenInstanceError` },
    ],
  },
  {
    id: "oop-slots",
    title: "__slots__",
    emoji: "📏",
    description: "Restrict instance attributes and save memory by listing allowed names in __slots__.",
    explanation: "Set __slots__ = (\"attr1\", \"attr2\") on the class. Instances can only have those attributes; no __dict__ is created, so memory use is lower. Useful for many small objects. Inheritance with slots can be tricky.",
    kidExplanation: "A fixed list of pockets — the object can only have those; no extra backpack.",
    examples: [
      { title: "Restricting attributes", code: `class Point:\n    __slots__ = ("x", "y")\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\np = Point(1, 2)\n# p.z = 3   # AttributeError` },
      { title: "Memory saving", code: `# Without __slots__, each instance has a __dict__\n# With __slots__, only named attributes exist\nclass Small:\n    __slots__ = ("a", "b")\n    def __init__(self, a, b):\n        self.a, self.b = a, b` },
    ],
  },
  {
    id: "oop-context-manager",
    title: "Context managers (__enter__ / __exit__)",
    emoji: "🚪",
    description: "Support with statements by implementing __enter__ and __exit__.",
    explanation: "Objects with __enter__ and __exit__ can be used in with obj: blocks. __enter__ runs at the start; __exit__(self, exc_type, exc_val, exc_tb) runs on exit (and can suppress exceptions). Use for resources that need setup/teardown.",
    kidExplanation: "Like a door: __enter__ is going in, __exit__ is leaving and closing the door.",
    examples: [
      { title: "Custom context manager", code: `class Timer:\n    def __enter__(self):\n        import time\n        self.start = time.perf_counter()\n        return self\n    def __exit__(self, *args):\n        self.elapsed = time.perf_counter() - self.start\n        print(f"Elapsed: {self.elapsed:.3f}s")\n\nimport time\nwith Timer():\n    time.sleep(0.1)            # Elapsed: ~0.1s` },
      { title: "Using contextlib (alternative)", code: `from contextlib import contextmanager\n\n@contextmanager\ndef tag(name):\n    print(f"<{name}>")\n    yield\n    print(f"</{name}>")\n\nwith tag("div"):\n    print("Hello")\n# <div>\n# Hello\n# </div>` },
    ],
  },
];

const dataTypesTopics = [
  { id: "dt-int", title: "int (integers)", emoji: "🔢", description: "Whole numbers; arithmetic, bitwise, and conversion.", explanation: "int is unbounded in Python 3. Supports + - * / // % **, bitwise & | ^ ~ << >>, abs(), divmod(), int(string, base). Use // for floor division and ** for exponentiation.", kidExplanation: "Numbers with no decimal part. You can add, subtract, multiply, and do special operations like integer division.", examples: [{ title: "Arithmetic and floor division", code: "a, b = 17, 5\nprint(a + b, a - b, a * b)   # 22 12 85\nprint(a / b)                  # 3.4 (float)\nprint(a // b, a % b)          # 3 2\nprint(2 ** 10)                # 1024" }, { title: "Conversion and divmod", code: "print(int(3.9))              # 3\nprint(int(\"42\"))              # 42\nprint(int(\"1010\", 2))         # 10 (binary)\nq, r = divmod(17, 5)\nprint(q, r)                   # 3 2" }] },
  { id: "dt-float", title: "float (decimals)", emoji: "📐", description: "Real numbers; math, rounding, and special values.", explanation: "IEEE 754. Use round(x, n), math.ceil, math.floor. Special: float('inf'), float('-inf'), float('nan'). Avoid == for floats; use math.isclose.", kidExplanation: "Numbers with a decimal point. Can be very big (infinity) or 'not a number' (nan).", examples: [{ title: "Basic float ops and rounding", code: "x, y = 3.5, 2.1\nprint(x + y, x * y)           # 5.6 7.35\nprint(round(3.14159, 2))      # 3.14\nimport math\nprint(math.ceil(2.3), math.floor(2.7))  # 3 2" }, { title: "inf, nan, and isclose", code: "print(float('inf') > 1e10)   # True\nprint(float('nan') == float('nan'))  # False\nimport math\nprint(math.isclose(0.1 + 0.2, 0.3))  # True" }] },
  { id: "dt-str", title: "str (strings)", emoji: "📝", description: "Text: indexing, slicing, methods, formatting.", explanation: "Immutable. Index [i], slice [i:j:k], + and *; in, not in. Methods: upper, lower, strip, split, join, replace, startswith, endswith, find, index, count, format, isdigit, isalpha. f-strings for formatting.", kidExplanation: "A sequence of characters. You can slice, search, and change how it looks (upper/lower).", examples: [{ title: "Indexing, slicing, and basic ops", code: 's = "Python"\nprint(s[0], s[-1])            # P n\nprint(s[1:4], s[::2])         # yth Po\nprint("Hi" + "!" * 3)         # Hi!!!\nprint("at" in "Python")       # False' }, { title: "Common string methods", code: 't = "  Hello World  "\nprint(t.strip().lower())      # hello world\nprint("a,b,c".split(","))     # [\'a\', \'b\', \'c\']\nprint("-".join(["x", "y"]))   # x-y\nprint("foo".replace("o", "0")) # f00' }, { title: "f-strings and format", code: 'name, age = "Alice", 30\nprint(f"{name} is {age}")     # Alice is 30\nprint(f"{3.14159:.2f}")       # 3.14\nprint("{} and {}".format(1, 2)) # 1 and 2' }] },
  { id: "dt-bool", title: "bool (True / False)", emoji: "✓", description: "Boolean values; truthiness and logical ops.", explanation: "Only True and False. Logical: and, or, not. Many types are truthy or falsy (e.g. 0, '', [], None are falsy). Short-circuit evaluation.", kidExplanation: "Yes or no. and, or, not combine them; Python stops early when the answer is clear.", examples: [{ title: "Logical operators", code: "print(True and False)         # False\nprint(True or False)          # True\nprint(not True)               # False\nprint(3 > 1 and 2 < 5)        # True" }, { title: "Truthiness", code: "print(bool(0), bool(1))      # False True\nprint(bool(''), bool('hi'))  # False True\nprint(bool([]), bool([1]))    # False True\nif []:\n    pass  # skipped" }] },
  { id: "dt-none", title: "None", emoji: "⬜", description: "Single value meaning 'no value' or missing.", explanation: "Type is NoneType. Only one value: None. Use for optional return, default args, or 'not set'. Identity check with is None.", kidExplanation: "A placeholder for 'nothing here'. Use 'is None' to check.", examples: [{ title: "None and identity check", code: "x = None\nprint(x is None)               # True\nprint(x == None)              # True (but prefer 'is')\ndef f(): pass\nprint(f())                    # None" }] },
  { id: "dt-bytes", title: "bytes and bytearray", emoji: "🔤", description: "Immutable and mutable byte sequences.", explanation: "bytes is immutable; bytearray is mutable. Create with b'...', bytes(iterable), or .encode(). Index returns int (0–255).", kidExplanation: "Raw bytes: numbers 0–255. bytes cannot change; bytearray can.", examples: [{ title: "bytes and bytearray", code: "b = b'hello'\nprint(b[0], b.decode())       # 104 hello\nba = bytearray(b)\nba[0] = 72\nprint(ba.decode())            # Hello" }] },
];

const collectionsTopics = [
  { id: "coll-list", title: "list", emoji: "📋", description: "Mutable ordered sequence; index, slice, append, extend, sort, comprehension.", explanation: "Lists are mutable, ordered, allow duplicates. Index [i], slice [i:j], append, extend, insert, remove, pop, clear, sort, reverse, count, index. List comprehensions [x for x in ... if ...].", kidExplanation: "An ordered container you can change: add, remove, reorder.", examples: [{ title: "Create, index, slice, modify", code: "lst = [3, 1, 4, 1, 5]\nlst[0] = 9\nprint(lst[1:4])              # [1, 4, 1]\nlst.append(6)\nlst.extend([7, 8])\nprint(lst)                    # [9,1,4,1,5,6,7,8]" }, { title: "remove, pop, insert, sort", code: "a = [10, 20, 30, 20]\na.remove(20)                 # removes first 20\nprint(a.pop())               # 20 (last)\na.insert(0, 0)\na.sort()\nprint(a)                     # [0, 10, 30]" }, { title: "List comprehension", code: "squares = [x**2 for x in range(5)]\nprint(squares)               # [0,1,4,9,16]\nevens = [n for n in [1,2,3,4,5] if n % 2 == 0]\nprint(evens)                  # [2, 4]" }] },
  { id: "coll-tuple", title: "tuple", emoji: "📦", description: "Immutable ordered sequence; unpacking and as keys.", explanation: "Immutable, ordered. Use for fixed data, multiple return values, or dict keys. Index and slice like list. Unpack: a, b = t.", kidExplanation: "Like a list but you cannot change it. Great for pairs or fixed data.", examples: [{ title: "Tuple basics and unpacking", code: "t = (1, 2, 3)\nprint(t[0], t[-1])            # 1 3\na, b, c = t\nprint(b)                     # 2\nx, *rest = (10, 20, 30)\nprint(rest)                   # [20, 30]" }, { title: "Tuple as dict key", code: "d = {(1, 2): \"point\", (0, 0): \"origin\"}\nprint(d[(1, 2)])             # point" }] },
  { id: "coll-set", title: "set", emoji: "🔮", description: "Unordered unique elements; add, remove, union, intersection.", explanation: "Mutable, unordered, no duplicates. add, remove, discard, clear. Set ops: | union, & intersection, - difference, ^ symmetric_difference. in is O(1).", kidExplanation: "A bag of unique items with no order. Fast 'is it in?' checks.", examples: [{ title: "Set operations", code: "s = {1, 2, 3}\ns.add(4)\ns.discard(2)\nprint(s)                     # {1,3,4}\na, b = {1,2,3}, {2,3,4}\nprint(a | b, a & b, a - b)   # {1,2,3,4} {2,3} {1}" }, { title: "Deduplicate and membership", code: "lst = [1, 2, 2, 3, 3, 3]\nprint(list(set(lst)))        # [1, 2, 3]\nprint(5 in {1, 2, 3})        # False" }] },
  { id: "coll-dict", title: "dict", emoji: "🗂️", description: "Key–value mapping; get, setdefault, update, comprehensions.", explanation: "Mutable mapping. keys(), values(), items(). get(key, default), setdefault, update, pop, popitem. dict comprehension {k: v for ...}. in checks keys.", kidExplanation: "Look up a value by its key. Like a real dictionary: word -> definition.", examples: [{ title: "Dict basics and get", code: "d = {\"a\": 1, \"b\": 2, \"c\": 3}\nprint(d[\"b\"], d.get(\"x\", 0)) # 2 0\nd[\"d\"] = 4\nd.update({\"e\": 5})\nprint(d)" }, { title: "setdefault and dict comprehension", code: "d = {}\nfor k in \"aba\":\n    d.setdefault(k, 0)\n    d[k] += 1\nprint(d)                     # {\"a\":2, \"b\":1}\nsq = {x: x**2 for x in range(4)}\nprint(sq)                    # {0:0, 1:1, 2:4, 3:9}" }] },
  { id: "coll-range", title: "range", emoji: "📏", description: "Immutable sequence of integers; memory-efficient.", explanation: "range(start, stop, step). Stop is exclusive. Used in for loops and to create lists with list(range(...)).", kidExplanation: "A lazy list of numbers without storing them all.", examples: [{ title: "range in loops and as sequence", code: "print(list(range(5)))        # [0,1,2,3,4]\nprint(list(range(2, 10, 2))) # [2,4,6,8]\nfor i in range(3):\n    print(i, end=\" \")          # 0 1 2" }] },
];

const operatorsTopics = [
  { id: "op-arith", title: "Arithmetic operators", emoji: "+", description: "+, -, *, /, //, %, **.", explanation: "/ always returns float in Python 3. // floor division, % remainder, ** exponentiation. divmod(a,b) returns (a//b, a%b).", kidExplanation: "Plus, minus, times, divide, integer divide, remainder, power.", examples: [{ title: "All arithmetic ops", code: "print(10 + 3, 10 - 3, 10 * 3)\nprint(10 / 3)    # 3.333...\nprint(10 // 3)   # 3\nprint(10 % 3)    # 1\nprint(2 ** 8)    # 256" }] },
  { id: "op-compare", title: "Comparison operators", emoji: "=", description: "==, !=, <, >, <=, >=.", explanation: "Return bool. != is 'not equal'. Chained comparisons: a < b < c is equivalent to a < b and b < c.", kidExplanation: "Compare two values; you get True or False.", examples: [{ title: "Comparisons and chaining", code: "print(3 == 3, 3 != 4)        # True True\nprint(2 < 5 <= 5)           # True (chained)\nprint(\"apple\" < \"banana\")   # True (lexicographic)" }] },
  { id: "op-logical", title: "Logical operators (and, or, not)", emoji: "&", description: "and, or, not; short-circuit evaluation.", explanation: "and/or return the last evaluated value. not returns bool. Short-circuit: False and x never evaluates x.", kidExplanation: "Combine True/False; Python may skip the rest if the answer is already clear.", examples: [{ title: "and, or, not and short-circuit", code: "print(True and 10)          # 10\nprint(0 or \"default\")        # default\nprint(not [])                # True\n# False and print(\"x\")  # print not called" }] },
  { id: "op-bitwise", title: "Bitwise operators", emoji: "⚡", description: "&, |, ^, ~, <<, >>.", explanation: "& AND, | OR, ^ XOR, ~ bitwise NOT, << left shift, >> right shift. Operate on integer bits.", kidExplanation: "Work on the 0s and 1s inside numbers.", examples: [{ title: "Bitwise operations", code: "print(5 & 3)   # 1 (101 & 011)\nprint(5 | 3)   # 7\nprint(5 ^ 3)   # 6\nprint(1 << 4)  # 16\nprint(8 >> 2)  # 2" }] },
  { id: "op-assign", title: "Assignment and augmented assignment", emoji: "=", description: "=, +=, -=, *=, /=, //=, %=, **=, &=, |=, ^=, <<=, >>=.", explanation: "x += 1 is x = x + 1. Augmented ops modify in place for mutables where defined.", kidExplanation: "Assign a value or update a variable in one step.", examples: [{ title: "Augmented assignment", code: "n = 10\nn += 5\nprint(n)       # 15\nlst = [1, 2]\nlst += [3]     # same as extend\nprint(lst)     # [1, 2, 3]" }] },
  { id: "op-identity", title: "Identity (is, is not)", emoji: "🆔", description: "is and is not compare object identity.", explanation: "Use is for None, sentinels, or 'same object'. == compares values. Two equal lists can be is not the same object.", kidExplanation: "is: 'same object in memory?' Use for None.", examples: [{ title: "is vs ==", code: "a = None\nprint(a is None)    # True\nx = [1, 2]\ny = [1, 2]\nprint(x == y)       # True\nprint(x is y)       # False" }] },
  { id: "op-membership", title: "Membership (in, not in)", emoji: "∈", description: "in and not in for sequences and mappings.", explanation: "Works on str, list, tuple, set, dict (keys), range. For dict, in checks keys.", kidExplanation: "Check if something is inside a container.", examples: [{ title: "in with different types", code: "print(3 in [1, 2, 3])       # True\nprint(\"ab\" in \"abc\")         # True\nprint(\"x\" not in {\"a\": 1})   # True (keys)" }] },
  { id: "op-walrus", title: "Walrus operator (:=)", emoji: "🐋", description: "Assign and use a value in one expression.", explanation: "Python 3.8+. (x := value) assigns and yields value. Useful in while conditions or list comprehensions.", kidExplanation: "Assign and use in the same line.", examples: [{ title: "Walrus in while and listcomp", code: "while (line := input().strip()) != \"quit\":\n    print(line)\n# Or: [y for x in data if (y := f(x)) > 0]" }] },
];

const conditionsTopics = [
  { id: "cond-if", title: "if / elif / else", emoji: "🔀", description: "Branch by condition; elif and else.", explanation: "Exactly one branch runs. elif = else if. Indentation defines the block. No parentheses required around condition.", kidExplanation: "If this is true do that, else do something else.", examples: [{ title: "if, elif, else", code: "x = 10\nif x < 0:\n    print(\"negative\")\nelif x == 0:\n    print(\"zero\")\nelse:\n    print(\"positive\")   # positive" }] },
  { id: "cond-ternary", title: "Conditional expression (ternary)", emoji: "❓", description: "value_if_true if condition else value_if_false.", explanation: "One expression that picks one of two values. Use for simple choices, not for side effects.", kidExplanation: "Choose one of two values in a single line.", examples: [{ title: "Ternary", code: "age = 20\nstatus = \"adult\" if age >= 18 else \"minor\"\nprint(status)   # adult\nprint(3 if True else 4)   # 3" }] },
  { id: "cond-match", title: "match / case (pattern matching)", emoji: "🎯", description: "Structural pattern matching (Python 3.10+).", explanation: "match value: then case pattern:. Match literals, sequences, mappings, or class patterns. More readable than long if/elif for complex cases.", kidExplanation: "Choose what to do based on the shape of the value.", examples: [{ title: "match with literals and patterns", code: "def http_status(code):\n    match code:\n        case 200: return \"OK\"\n        case 404: return \"Not Found\"\n        case _: return \"Unknown\"\nprint(http_status(404))   # Not Found" }] },
  { id: "cond-truth", title: "Truthiness and short-circuit", emoji: "💡", description: "Falsy: False, 0, '', None, [], {}, (). Rest are truthy.", explanation: "if x: uses truthiness. and/or short-circuit: second operand not evaluated if the first determines the result.", kidExplanation: "Some values count as False (empty, zero, None); everything else is True.", examples: [{ title: "Falsy values", code: "if not \"\":\n    print(\"empty is falsy\")\nif [1, 2]:\n    print(\"non-empty is truthy\")\n# 0 or 1/0  would raise; 1 or 1/0  returns 1" }] },
];

const loopsTopics = [
  { id: "loop-for", title: "for loop", emoji: "🔄", description: "Iterate over iterables: sequences, range, enumerate, zip.", explanation: "for item in iterable:. Works on list, tuple, str, set, dict (keys by default), range, files. Use enumerate for index, zip for parallel iteration.", kidExplanation: "Do something for each item in a collection.", examples: [{ title: "for over list, range, dict", code: "for x in [1, 2, 3]:\n    print(x)\nfor i in range(3):\n    print(i)\nfor k, v in {\"a\": 1, \"b\": 2}.items():\n    print(k, v)" }, { title: "enumerate and zip", code: "for i, name in enumerate([\"a\", \"b\"]):\n    print(i, name)   # 0 a, 1 b\nfor x, y in zip([1, 2], [10, 20]):\n    print(x + y)     # 11, 22" }] },
  { id: "loop-while", title: "while loop", emoji: "⏳", description: "Repeat while condition is true.", explanation: "while condition: block. Ensure condition becomes false or use break to avoid infinite loops.", kidExplanation: "Keep doing this until the condition is no longer true.", examples: [{ title: "while basics", code: "n = 0\nwhile n < 3:\n    print(n)\n    n += 1\n# 0, 1, 2" }] },
  { id: "loop-break-continue", title: "break and continue", emoji: "⏹️", description: "break exits the loop; continue skips to next iteration.", explanation: "break leaves the innermost for/while. continue skips the rest of the current iteration and continues the loop.", kidExplanation: "break = stop the loop now. continue = skip to the next round.", examples: [{ title: "break and continue", code: "for i in range(5):\n    if i == 2:\n        continue\n    if i == 4:\n        break\n    print(i)   # 0, 1, 3" }] },
  { id: "loop-else", title: "else on loops", emoji: "🔚", description: "else runs if loop completes without break.", explanation: "for/while can have an else clause. It runs only when the loop ends normally (no break). Useful for search loops.", kidExplanation: "A block that runs only if you never hit 'break'.", examples: [{ title: "for-else (found or not)", code: "for x in [1, 2, 3]:\n    if x == 2:\n        print(\"found\")\n        break\nelse:\n    print(\"not found\")   # does not run (break happened)" }] },
  { id: "loop-nested", title: "Nested loops", emoji: "📦", description: "Loops inside loops; typical for 2D or combinations.", explanation: "Inner loop runs fully for each outer iteration. Useful for matrices, Cartesian product, or nested structures.", kidExplanation: "A loop inside another loop: for each outer step, do all inner steps.", examples: [{ title: "Nested loop (e.g. table)", code: "for i in range(2):\n    for j in range(3):\n        print(i, j, end=\" \")\n    print()\n# 0 0, 0 1, 0 2\n# 1 0, 1 1, 1 2" }] },
];

function AifaLogo({ variant = "default" }: { variant?: "default" | "light" }) {
  const [imgError, setImgError] = useState(false);
  const isLight = variant === "light";
  return (
    <span className="font-bold text-xl tracking-tight inline-flex items-center">
      {!imgError ? (
        <Image
          src="/aifa-logo.png"
          alt="aifa"
          width={100}
          height={32}
          className={`h-8 w-auto object-contain ${isLight ? "brightness-0 invert" : ""}`}
          unoptimized
          onError={() => setImgError(true)}
        />
      ) : (
        <>
          <span className={isLight ? "text-blue-200" : "text-[#2563eb]"}>ai</span>
          <span className={isLight ? "text-white" : "text-neutral-800"}>fa</span>
        </>
      )}
    </span>
  );
}

export default function LearnersPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button type="button" onClick={() => scrollTo("#hero")} className="flex items-center" aria-label="aifa home">
            <AifaLogo />
          </button>
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.slice(0, 1).map((link) => (
              <button key={link.href} type="button" onClick={() => scrollTo(link.href)} className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                {link.label}
              </button>
            ))}
            <span className="text-neutral-300">|</span>
            {navLinks.slice(1, 7).map((link) => (
              <button key={link.href} type="button" onClick={() => scrollTo(link.href)} className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors whitespace-nowrap">
                {link.label}
              </button>
            ))}
            <span className="text-neutral-300">|</span>
            {navLinks.slice(7, 9).map((link) => (
              <button key={link.href} type="button" onClick={() => scrollTo(link.href)} className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                {link.label}
              </button>
            ))}
          </nav>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        {mobileMenuOpen && (
          <div className="border-t border-neutral-200 bg-white px-4 py-4 md:hidden">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => scrollTo(link.href)}
                  className="text-left py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="hero" className="relative pt-24 pb-16 sm:pt-28 sm:pb-20 overflow-hidden min-h-[420px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-blue-800/90 to-indigo-900/95" />
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=1920"
            alt=""
            fill
            className="object-cover opacity-25"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-3 rounded-full bg-white/15 backdrop-blur-sm px-4 py-2 mb-6">
            <AifaLogo variant="light" />
            <span className="text-sm font-semibold text-white/95 uppercase tracking-wider">Learner&apos;s track</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl drop-shadow-sm">
            Master Python: From Basics to Functions &amp; OOP
          </h1>
          <p className="mt-6 text-lg text-blue-100 max-w-2xl mx-auto">
            Data types, collections, operators, conditions, loops, then functions and class design — one clear path with runnable examples.
          </p>
          <Button size="lg" className="mt-8 gap-2 bg-white text-blue-900 hover:bg-blue-50" onClick={() => scrollTo("#toc")}>
            Start learning
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Table of contents */}
      <section id="toc" className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 p-8 sm:p-10 mb-14">
            <div className="absolute inset-0">
              <Image src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800" alt="" fill className="object-cover opacity-20" sizes="800px" />
            </div>
            <div className="relative flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center p-2 [&_img]:max-h-12">
                <AifaLogo variant="light" />
              </div>
              <div>
                <Badge className="mb-2 bg-white/20 text-white border-0">
                  <BookOpen className="w-3 h-3 mr-1" />
                  aifa · Table of contents
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Your learning path
                </h2>
                <p className="mt-2 text-blue-100 max-w-xl">
                  Follow step 1 → 2 → 3, or jump to any topic. Each section has clear explanations and runnable examples.
                </p>
              </div>
            </div>
          </div>

          {/* 1. Fundamentals */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold">1</span>
              <h3 className="text-lg font-bold text-neutral-900">Fundamentals</h3>
            </div>
            <p className="text-sm text-neutral-600 mb-4">Data types, collections, operators, conditions, and loops.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {dataTypesTopics.map((t) => (
                <button key={t.id} type="button" onClick={() => scrollTo(`#${t.id}`)} className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 text-left transition-all hover:shadow hover:border-emerald-300">
                  <span className="text-xl block mb-1">{t.emoji}</span>
                  <h4 className="font-semibold text-neutral-900 text-sm">{t.title}</h4>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {collectionsTopics.map((t) => (
                <button key={t.id} type="button" onClick={() => scrollTo(`#${t.id}`)} className="rounded-xl border border-violet-200 bg-violet-50/50 p-4 text-left transition-all hover:shadow hover:border-violet-300">
                  <span className="text-xl block mb-1">{t.emoji}</span>
                  <h4 className="font-semibold text-neutral-900 text-sm">{t.title}</h4>
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {operatorsTopics.map((t) => (
                <button key={t.id} type="button" onClick={() => scrollTo(`#${t.id}`)} className="rounded-lg border border-sky-200 bg-sky-50/50 px-3 py-2 text-left text-sm font-medium hover:shadow hover:border-sky-300">{t.emoji} {t.title}</button>
              ))}
              {conditionsTopics.map((t) => (
                <button key={t.id} type="button" onClick={() => scrollTo(`#${t.id}`)} className="rounded-lg border border-rose-200 bg-rose-50/50 px-3 py-2 text-left text-sm font-medium hover:shadow hover:border-rose-300">{t.emoji} {t.title}</button>
              ))}
              {loopsTopics.map((t) => (
                <button key={t.id} type="button" onClick={() => scrollTo(`#${t.id}`)} className="rounded-lg border border-teal-200 bg-teal-50/50 px-3 py-2 text-left text-sm font-medium hover:shadow hover:border-teal-300">{t.emoji} {t.title}</button>
              ))}
            </div>
          </div>

          {/* 2. Function types */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-bold">2</span>
              <h3 className="text-lg font-bold text-neutral-900">Function types</h3>
            </div>
            <p className="text-sm text-neutral-600 mb-4">Built-in, user-defined, lambda, recursive, higher-order, generators, and more.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {functionTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => scrollTo(`#${type.id}`)}
                  className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-5 text-left transition-all hover:shadow-lg hover:border-blue-200 hover:bg-blue-50/30"
                >
                  <span className="text-2xl block mb-2">{type.emoji}</span>
                  <h4 className="font-semibold text-neutral-900 text-sm">{type.title}</h4>
                  <p className="mt-1 text-xs text-neutral-600 line-clamp-2">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Object-oriented */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-sm font-bold">3</span>
              <h3 className="text-lg font-bold text-neutral-900">Object-oriented (class design)</h3>
            </div>
            <p className="text-sm text-neutral-600 mb-4">Classes, methods, inheritance, ABCs, magic methods, dataclasses, and more.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {oopTopics.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => scrollTo(`#${topic.id}`)}
                  className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 text-left transition-all hover:shadow-lg hover:border-amber-300"
                >
                  <span className="text-2xl block mb-2">{topic.emoji}</span>
                  <h4 className="font-semibold text-neutral-900 text-sm">{topic.title}</h4>
                  <p className="mt-1 text-xs text-neutral-600 line-clamp-2">{topic.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-neutral-200 text-center">
            <Button variant="outline" onClick={() => scrollTo("#summary")}>Jump to Summary</Button>
          </div>
        </div>
      </section>

      {/* 1. Data types */}
      <section id="datatypes" className="py-16 sm:py-20 bg-emerald-50/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl bg-emerald-100/60 border border-emerald-200 p-6 sm:p-8 mb-12">
            <div className="relative w-full sm:w-48 h-32 sm:h-36 rounded-xl overflow-hidden flex-shrink-0">
              <Image src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400" alt="Code and data" fill className="object-cover" sizes="400px" />
            </div>
            <div className="text-center sm:text-left">
              <Badge className="mb-2 bg-emerald-200 text-emerald-900 border-0">1 · Fundamentals</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">Data types</h2>
              <p className="mt-2 text-neutral-700">int, float, str, bool, None, bytes — build a solid base with operations and examples.</p>
            </div>
          </div>
          {dataTypesTopics.map((topic, index) => (
            <div key={topic.id} id={topic.id} className="scroll-mt-24 pb-12 last:pb-8">
              <div className="rounded-2xl border border-emerald-200/80 bg-white p-8 shadow-sm mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{topic.emoji}</span>
                  <div>
                    <Badge variant="secondary" className="mb-1 bg-emerald-100 text-emerald-800">{index + 1} of {dataTypesTopics.length}</Badge>
                    <h2 className="text-2xl font-bold text-neutral-900">{topic.title}</h2>
                  </div>
                </div>
                <p className="text-neutral-700 mb-4">{topic.description}</p>
                {"explanation" in topic && <p className="text-neutral-600 text-sm leading-relaxed mb-6">{topic.explanation}</p>}
                <Card className="mb-6 border-emerald-100 bg-emerald-50/50">
                  <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Lightbulb className="w-4 h-4 text-emerald-600" />In plain words</CardTitle></CardHeader>
                  <CardContent><p className="text-neutral-700 text-sm">{topic.kidExplanation}</p></CardContent>
                </Card>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-700 mb-3 flex items-center gap-2"><Code className="w-4 h-4" />Examples</h3>
                  {topic.examples.map((ex, i) => <CodeBlock key={i} code={ex.code} language="python" filename={`${topic.id}-${i + 1}.py`} />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Collections */}
      <section id="collections" className="py-16 sm:py-20 bg-violet-50/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl bg-violet-100/60 border border-violet-200 p-6 sm:p-8 mb-12">
            <div className="relative w-full sm:w-48 h-32 sm:h-36 rounded-xl overflow-hidden flex-shrink-0 order-2 sm:order-1">
              <Image src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400" alt="Structured data" fill className="object-cover" sizes="400px" />
            </div>
            <div className="text-center sm:text-left order-1 sm:order-2 flex-1">
              <Badge className="mb-2 bg-violet-200 text-violet-900 border-0">Fundamentals</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">Collections</h2>
              <p className="mt-2 text-neutral-700">list, tuple, set, dict, range — store and work with data using the right structure.</p>
            </div>
          </div>
          {collectionsTopics.map((topic, index) => (
            <div key={topic.id} id={topic.id} className="scroll-mt-24 pb-12 last:pb-8">
              <div className="rounded-2xl border border-violet-200/80 bg-white p-8 shadow-sm mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{topic.emoji}</span>
                  <div>
                    <Badge variant="secondary" className="mb-1 bg-violet-100 text-violet-800">{index + 1} of {collectionsTopics.length}</Badge>
                    <h2 className="text-2xl font-bold text-neutral-900">{topic.title}</h2>
                  </div>
                </div>
                <p className="text-neutral-700 mb-4">{topic.description}</p>
                {"explanation" in topic && <p className="text-neutral-600 text-sm leading-relaxed mb-6">{topic.explanation}</p>}
                <Card className="mb-6 border-violet-100 bg-violet-50/50">
                  <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Lightbulb className="w-4 h-4 text-violet-600" />In plain words</CardTitle></CardHeader>
                  <CardContent><p className="text-neutral-700 text-sm">{topic.kidExplanation}</p></CardContent>
                </Card>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-700 mb-3 flex items-center gap-2"><Code className="w-4 h-4" />Examples</h3>
                  {topic.examples.map((ex, i) => <CodeBlock key={i} code={ex.code} language="python" filename={`${topic.id}-${i + 1}.py`} />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Operators */}
      <section id="operators" className="py-16 sm:py-20 bg-sky-50/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl bg-sky-100/60 border border-sky-200 p-6 sm:p-8 mb-12">
            <div className="relative w-full sm:w-48 h-32 sm:h-36 rounded-xl overflow-hidden flex-shrink-0">
              <Image src="https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400" alt="Logic and operations" fill className="object-cover" sizes="400px" />
            </div>
            <div className="text-center sm:text-left">
              <Badge className="mb-2 bg-sky-200 text-sky-900 border-0">Fundamentals</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">Operators</h2>
              <p className="mt-2 text-neutral-700">Arithmetic, comparison, logical, bitwise, assignment, identity, membership, and the walrus operator.</p>
            </div>
          </div>
          {operatorsTopics.map((topic, index) => (
            <div key={topic.id} id={topic.id} className="scroll-mt-24 pb-12 last:pb-8">
              <div className="rounded-2xl border border-sky-200/80 bg-white p-8 shadow-sm mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{topic.emoji}</span>
                  <div>
                    <Badge variant="secondary" className="mb-1 bg-sky-100 text-sky-800">{index + 1} of {operatorsTopics.length}</Badge>
                    <h2 className="text-2xl font-bold text-neutral-900">{topic.title}</h2>
                  </div>
                </div>
                <p className="text-neutral-700 mb-4">{topic.description}</p>
                {"explanation" in topic && <p className="text-neutral-600 text-sm leading-relaxed mb-6">{topic.explanation}</p>}
                <Card className="mb-6 border-sky-100 bg-sky-50/50">
                  <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Lightbulb className="w-4 h-4 text-sky-600" />In plain words</CardTitle></CardHeader>
                  <CardContent><p className="text-neutral-700 text-sm">{topic.kidExplanation}</p></CardContent>
                </Card>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-700 mb-3 flex items-center gap-2"><Code className="w-4 h-4" />Examples</h3>
                  {topic.examples.map((ex, i) => <CodeBlock key={i} code={ex.code} language="python" filename={`${topic.id}-${i + 1}.py`} />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Conditions */}
      <section id="conditions" className="py-16 sm:py-20 bg-rose-50/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl bg-rose-100/60 border border-rose-200 p-6 sm:p-8 mb-12">
            <div className="relative w-full sm:w-48 h-32 sm:h-36 rounded-xl overflow-hidden flex-shrink-0 order-2 sm:order-1">
              <Image src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400" alt="Branching logic" fill className="object-cover" sizes="400px" />
            </div>
            <div className="text-center sm:text-left order-1 sm:order-2 flex-1">
              <Badge className="mb-2 bg-rose-200 text-rose-900 border-0">Fundamentals</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">Conditions</h2>
              <p className="mt-2 text-neutral-700">if/elif/else, ternary, match/case, and truthiness — control the flow of your program.</p>
            </div>
          </div>
          {conditionsTopics.map((topic, index) => (
            <div key={topic.id} id={topic.id} className="scroll-mt-24 pb-12 last:pb-8">
              <div className="rounded-2xl border border-rose-200/80 bg-white p-8 shadow-sm mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{topic.emoji}</span>
                  <div>
                    <Badge variant="secondary" className="mb-1 bg-rose-100 text-rose-800">{index + 1} of {conditionsTopics.length}</Badge>
                    <h2 className="text-2xl font-bold text-neutral-900">{topic.title}</h2>
                  </div>
                </div>
                <p className="text-neutral-700 mb-4">{topic.description}</p>
                {"explanation" in topic && <p className="text-neutral-600 text-sm leading-relaxed mb-6">{topic.explanation}</p>}
                <Card className="mb-6 border-rose-100 bg-rose-50/50">
                  <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Lightbulb className="w-4 h-4 text-rose-600" />In plain words</CardTitle></CardHeader>
                  <CardContent><p className="text-neutral-700 text-sm">{topic.kidExplanation}</p></CardContent>
                </Card>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-700 mb-3 flex items-center gap-2"><Code className="w-4 h-4" />Examples</h3>
                  {topic.examples.map((ex, i) => <CodeBlock key={i} code={ex.code} language="python" filename={`${topic.id}-${i + 1}.py`} />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Loops */}
      <section id="loops" className="py-16 sm:py-20 bg-teal-50/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl bg-teal-100/60 border border-teal-200 p-6 sm:p-8 mb-12">
            <div className="relative w-full sm:w-48 h-32 sm:h-36 rounded-xl overflow-hidden flex-shrink-0">
              <Image src="https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400" alt="Iteration" fill className="object-cover" sizes="400px" />
            </div>
            <div className="text-center sm:text-left">
              <Badge className="mb-2 bg-teal-200 text-teal-900 border-0">Fundamentals</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">Loops</h2>
              <p className="mt-2 text-neutral-700">for, while, break, continue, else on loops, and nested loops — repeat with control.</p>
            </div>
          </div>
          {loopsTopics.map((topic, index) => (
            <div key={topic.id} id={topic.id} className="scroll-mt-24 pb-12 last:pb-8">
              <div className="rounded-2xl border border-teal-200/80 bg-white p-8 shadow-sm mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{topic.emoji}</span>
                  <div>
                    <Badge variant="secondary" className="mb-1 bg-teal-100 text-teal-800">{index + 1} of {loopsTopics.length}</Badge>
                    <h2 className="text-2xl font-bold text-neutral-900">{topic.title}</h2>
                  </div>
                </div>
                <p className="text-neutral-700 mb-4">{topic.description}</p>
                {"explanation" in topic && <p className="text-neutral-600 text-sm leading-relaxed mb-6">{topic.explanation}</p>}
                <Card className="mb-6 border-teal-100 bg-teal-50/50">
                  <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Lightbulb className="w-4 h-4 text-teal-600" />In plain words</CardTitle></CardHeader>
                  <CardContent><p className="text-neutral-700 text-sm">{topic.kidExplanation}</p></CardContent>
                </Card>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-700 mb-3 flex items-center gap-2"><Code className="w-4 h-4" />Examples</h3>
                  {topic.examples.map((ex, i) => <CodeBlock key={i} code={ex.code} language="python" filename={`${topic.id}-${i + 1}.py`} />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Function types */}
      <section id="functions" className="py-16 sm:py-20 bg-neutral-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl bg-blue-100/60 border border-blue-200 p-6 sm:p-8 mb-12">
            <div className="relative w-full sm:w-48 h-32 sm:h-36 rounded-xl overflow-hidden flex-shrink-0">
              <Image src="https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400" alt="Python functions" fill className="object-cover" sizes="400px" />
            </div>
            <div className="text-center sm:text-left">
              <Badge className="mb-2 bg-blue-200 text-blue-900 border-0">2 · Function types</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">Functions in Python</h2>
              <p className="mt-2 text-neutral-700">Built-in, user-defined, lambda, recursive, higher-order, generators, closures, methods, and async — with examples.</p>
            </div>
          </div>
          {functionTypes.map((type, index) => (
            <div key={type.id} id={type.id} className="scroll-mt-24 pb-16 last:pb-8">
              <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{type.emoji}</span>
                  <div>
                    <Badge variant="secondary" className="mb-1">
                      {index + 1} of {functionTypes.length}
                    </Badge>
                    <h2 className="text-2xl font-bold text-neutral-900">{type.title}</h2>
                  </div>
                </div>
                <p className="text-neutral-700 mb-4">{type.description}</p>
                {"explanation" in type && (
                  <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                    {type.explanation}
                  </p>
                )}
                <Card className="mb-6 border-blue-100 bg-blue-50/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      In plain words
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutral-700 text-sm">{type.kidExplanation}</p>
                  </CardContent>
                </Card>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-700 mb-3 flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Use cases and examples
                  </h3>
                  {type.examples.map((ex, i) => (
                    <CodeBlock
                      key={i}
                      code={ex.code}
                      language="python"
                      filename={`${type.id}-${i + 1}.py`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. OOP / Class design */}
      <section id="oop" className="py-16 sm:py-20 bg-amber-50/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl bg-amber-100/60 border border-amber-200 p-6 sm:p-8 mb-12">
            <div className="relative w-full sm:w-48 h-32 sm:h-36 rounded-xl overflow-hidden flex-shrink-0 order-2 sm:order-1">
              <Image src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400" alt="Object-oriented design" fill className="object-cover" sizes="400px" />
            </div>
            <div className="text-center sm:text-left order-1 sm:order-2 flex-1">
              <Badge className="mb-2 bg-amber-200 text-amber-900 border-0">3 · Object-oriented</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">Class design in Python</h2>
              <p className="mt-2 text-neutral-700">Instances, attributes, methods, inheritance, ABCs, magic methods, dataclasses, slots, and context managers.</p>
            </div>
          </div>
          {oopTopics.map((topic, index) => (
            <div key={topic.id} id={topic.id} className="scroll-mt-24 pb-16 last:pb-8">
              <div className="rounded-2xl border border-amber-200/80 bg-white p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{topic.emoji}</span>
                  <div>
                    <Badge variant="secondary" className="mb-1 bg-amber-100 text-amber-800">
                      {index + 1} of {oopTopics.length}
                    </Badge>
                    <h2 className="text-2xl font-bold text-neutral-900">{topic.title}</h2>
                  </div>
                </div>
                <p className="text-neutral-700 mb-4">{topic.description}</p>
                {"explanation" in topic && (
                  <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                    {topic.explanation}
                  </p>
                )}
                <Card className="mb-6 border-amber-100 bg-amber-50/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      In plain words
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutral-700 text-sm">{topic.kidExplanation}</p>
                  </CardContent>
                </Card>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-700 mb-3 flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Use cases and examples
                  </h3>
                  {topic.examples.map((ex, i) => (
                    <CodeBlock
                      key={i}
                      code={ex.code}
                      language="python"
                      filename={`${topic.id}-${i + 1}.py`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Summary */}
      <section id="summary" className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl bg-neutral-100 border border-neutral-200 p-6 sm:p-8 mb-12">
            <div className="relative w-full sm:w-48 h-32 sm:h-36 rounded-xl overflow-hidden flex-shrink-0">
              <Image src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400" alt="Summary and review" fill className="object-cover" sizes="400px" />
            </div>
            <div className="text-center sm:text-left">
              <Badge className="mb-2 bg-neutral-200 text-neutral-800 border-0">
                <Layers className="w-3 h-3 mr-1" />
                Quick reference
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                Summary
              </h2>
              <p className="mt-2 text-neutral-700">
                aifa · All topics at a glance in the same order: 1 Fundamentals → 2 Functions → 3 OOP.
              </p>
            </div>
          </div>
          <h3 className="text-lg font-bold text-neutral-900 mt-6 mb-3">1 · Fundamentals</h3>
          <div className="grid gap-6 sm:grid-cols-2 mb-8">
            <div className="rounded-2xl border border-neutral-200 overflow-hidden bg-white shadow-sm">
              <div className="bg-emerald-50 px-4 py-2 font-semibold text-sm">Data types</div>
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-neutral-100">
                  {dataTypesTopics.map((t) => (
                    <tr key={t.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-2"><span className="mr-2">{t.emoji}</span>{t.title}</td>
                      <td className="px-4 py-2 text-neutral-600 text-xs">{t.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="rounded-2xl border border-neutral-200 overflow-hidden bg-white shadow-sm">
              <div className="bg-violet-50 px-4 py-2 font-semibold text-sm">Collections</div>
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-neutral-100">
                  {collectionsTopics.map((t) => (
                    <tr key={t.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-2"><span className="mr-2">{t.emoji}</span>{t.title}</td>
                      <td className="px-4 py-2 text-neutral-600 text-xs">{t.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="rounded-2xl border border-neutral-200 overflow-hidden bg-white shadow-sm sm:col-span-2">
              <div className="bg-sky-50 px-4 py-2 font-semibold text-sm">Operators · Conditions · Loops</div>
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-neutral-100">
                  {[...operatorsTopics, ...conditionsTopics, ...loopsTopics].map((t) => (
                    <tr key={t.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-2"><span className="mr-2">{t.emoji}</span>{t.title}</td>
                      <td className="px-4 py-2 text-neutral-600 text-xs">{t.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <h3 className="text-lg font-bold text-neutral-900 mt-8 mb-3">2 · Function types</h3>
          <div className="rounded-2xl border border-neutral-200 overflow-hidden bg-white shadow-sm mb-8">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-100 border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3 font-semibold text-neutral-900">Function type</th>
                  <th className="px-4 py-3 font-semibold text-neutral-900">Use when</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {functionTypes.map((type) => (
                  <tr key={type.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <span className="mr-2">{type.emoji}</span>
                      <span className="font-medium">{type.title}</span>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{type.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className="text-lg font-bold text-neutral-900 mt-8 mb-3">3 · Class design (OOP)</h3>
          <div className="rounded-2xl border border-amber-200 overflow-hidden bg-white shadow-sm mb-8">
            <table className="w-full text-left text-sm">
              <thead className="bg-amber-50 border-b border-amber-200">
                <tr>
                  <th className="px-4 py-3 font-semibold text-neutral-900">OOP topic</th>
                  <th className="px-4 py-3 font-semibold text-neutral-900">Use when</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {oopTopics.map((topic) => (
                  <tr key={topic.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <span className="mr-2">{topic.emoji}</span>
                      <span className="font-medium">{topic.title}</span>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{topic.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-10 text-center">
            <Button variant="outline" size="lg" className="gap-2" onClick={() => scrollTo("#toc")}>
              Back to table of contents
              <ArrowRight className="h-4 w-4 rotate-180" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-neutral-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button type="button" onClick={() => scrollTo("#hero")} className="flex items-center gap-2" aria-label="aifa home">
            <AifaLogo />
            <span className="text-sm font-medium text-neutral-600">aifa</span>
          </button>
          <p className="text-sm text-neutral-500">
            Powered by <strong className="text-neutral-700">aifa</strong> · Learner&apos;s track · Python fundamentals, functions &amp; OOP
          </p>
        </div>
      </footer>

      {scrolled && (
        <Button
          size="icon"
          className="fixed bottom-6 right-6 rounded-full shadow-lg z-40"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
