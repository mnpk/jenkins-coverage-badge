# jenkins-coverage-badge

The MISSING [shields.io](http://shields.io) badge, Jenkins-coverage.

This tiny web server will generate your Jenkins-code-coverage badge!


## Install & Run
```bash
# install
$ npm install -g jenkins-coverage-badge

# run with port number (default: 9913)
$ jcb 80
Listening on port 80...

```

Now you can get coverage badge with,

`http://host:port/jenkins/c/http/:jenkins_url/job/:job`

## Example

![coverage](http://www.mnpk.org/jenkins/c/http/d7.mnpk.org/jenkins/job/adm?style=flat-square)
```
![coverage](http://www.mnpk.org/jenkins/c/http/d7.mnpk.org/jenkins/job/adm?style=flat-square)
```
 
## License
MIT
