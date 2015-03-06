# jenkins-coverage-badge

Generate test-coverage badge from your Jenkins!

*(Using [shields.io](http://shields.io))*


## Install & Run
```bash
# install globally
$ npm install -g jenkins-coverage-badge

# run with port number (default: 9913)
$ jcb 80
Listening on port 80...

```

Now you can get coverage badge with,

`http://host:port/jenkins/c/http/:jenkins_url/job/:job`

## Example

![coverage](http://www.mnpk.org/jenkins/c/http/d7.mnpk.org/jenkins/job/adm)
```
![coverage](http://www.mnpk.org/jenkins/c/http/d7.mnpk.org/jenkins/job/adm)
```
 
## License
MIT
