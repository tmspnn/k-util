# k-util
Utility functions of komponenrtize.js

## Installation
#### Node
```
npm install k-util
```
#### Browser
```
<script src="node_modules/k-util/dist/k-util.min.js"></script>
```

## Methods
- ```isInt(v: Any): Bool```

- ```toInt(v: Any): Int``` return ```0``` when v is falsy value

- ```isString(v: Any): Bool```

- ```toString(v: Any): String``` return ```''``` when v is falsy value

- ```isObject(v: Any): Bool```

- ```isArray(v: Any): Bool```

- ```toArray(v: Any): Array``` return ```[]``` when v is falsy value

- ```isFunction(v: Any): Bool```

- ```isNull(v: Any): Bool``` return ```true``` when v is ```null``` or ```undefined```

- ```isJSON(v: Any): Bool``` return ```true``` when v is a ```JSON``` string

- ```assign(v: Object, [p: Object, ...])``` same as ```Object.assign```

- ```getRandomStr``` return a 16 characters(a-z0-9) random string