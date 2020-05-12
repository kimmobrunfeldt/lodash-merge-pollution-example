# Demonstration of _.merge pollution vulnerability

Prototype pollution is one of those security warnings that npm install sometimes outputs.
This repo demonstrates this exact security vulnerability: https://snyk.io/vuln/SNYK-JS-LODASHMERGE-173732.

Other links:

* How prototype pollution might lead to RCE: https://research.securitum.com/prototype-pollution-rce-kibana-cve-2019-7609/
* More real-world exploits: https://github.com/HoLyVieR/prototype-pollution-nsec18/blob/master/paper/JavaScript_prototype_pollution_attack_in_NodeJS.pdf
* https://medium.com/node-modules/what-is-prototype-pollution-and-why-is-it-such-a-big-deal-2dd8d89a93c.


## Test it your self

In the package.json, lodash has been specifically locked to vulnerable version `4.6.1`. Also express-validation is specifically using the 1. major version since it used to allow unknown properties in schemas.

* `git clone git@github.com:kimmobrunfeldt/lodash-merge-pollution-example.git`
* `cd lodash-merge-pollution-example`
* `npm i`
* `npm start` to start the express server
* Then in another console `curl -H"content-type: application/json" -d@attack.json http://localhost:9999/api/orders`
* After that the global object constructor has been polluted (as far a I understand correctly)

    This means that whenever any part of the code for example creates a new object, it's prototype
    will have the properties given in [attack.json](attack.json).

    ```js
    const newObj = {};
    // newObj.test equals now `true`
    ```

* If you call `curl http://localhost:9999/api/orders/0000` you can notice that the prototype pollution affects the whole node process.



## How to prevent this

Snyk has a good list how to prevent the vulnerability here: https://snyk.io/vuln/SNYK-JS-LODASHMERGE-173732#how-to-prevent.
Below are my personal main tactics to deal with the issue.

### Keep dependencies updated

By default npm will use a range of semver in package.json, so doing a re-install will also update
package-lock.json and should install the new security fixes.

For example `"lodash": "^4.6.1"` in package.json should now install the latest (at this moment) `4.17.15` version
since the hat character (`^`) allows semver minor and patch updates when the version is >= major 1.


### Disallow unexpected input

In this example, we have [express-validation](https://github.com/andrewkeig/express-validation) which
is great. However the older version (1.x.x) allows unknown properties by default.

The newer version which is safer by default and disallows all unknown properties from schemas.
