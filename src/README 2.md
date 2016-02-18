##Todo App (MIT License)

Simple redis backed todo app.

##Install Node and Redis

Go to http://nodejs.org and install NodeJS

Go to http://redis.io/download and install Redis

##Run Locally

Install all the dependencies:

    npm install (you may need to prefix this with sudo if you're on Mac)

Run the app:

    node server.js

Then navigate to `http://localhost:3000`

##Signing up, and deploying to Nodejitsu

###Documentation

The documenation was available on the front page (right under the sign up for free button): https://www.nodejitsu.com/getting-started/

Install the Nodejitsu Package

    npm install jitsu -g (you may need to prefix this with sudo if you're on Mac)

Register via the command line:

    jitsu signup (yes you can sign up via the command line)

You'll get a confirmation email with a command to type in:

    jitsu users confirm [username] [confirmation-guid]

If you've already registered, you can login with:

    jitsu login

After you confirm your email, you can login (the `confirm` command should prompt you to log in).

Change the `subdomain` value in `package.json`, to reflect the url you want to deploy to:

    {
      "name": "nodejs-todo",
      [...],
      "subdomain": "nodejs-todo" <--- this value
    }

create a redis database:

    jitsu databases create redis todo

You'll get an output similar to this:

    info: Executing command databases create redis todo
    info: A new redis has been created
    data: Database Type: redis
    data: Database Name: todo
    data: Connection host: nodejitsu___________.redis._______.com
    data: Connection port: 6379
    data: Connection auth: nodejitsu___________.redis._______.com:__________

update the values in `secret.js`

    module.exports = {
        ...
        "redisPort": 6379, //Connection port value from output above
        "redisMachine": "", //Connection host value from output above
        "redisAuth": "", //Connection auth value from output above
        ...
    };

now deploy:

    jitsu deploy

note: **if you add lib/secret.js to your .gitignore it will not be deployed and the app will not run**. Ideally (once you get the hang of deploying this app), you'll want to move all the information in secret.js to environment variables in your production environment, for information on getting and setting environment variables for nodejitsu use `jitsu help env`.

Here is what secret.js may look like after migrating everything over to environment variables:

    module.exports = {
        "consumerKey": process.env.consumerKey,
        [...]
    }

And your app should be up on Nodejitsu.

##Signing up, and deploying to Heroku

###Documentation

From heroku.com, click Documentation, then click the Getting Started button, then click Node.js from the list of options on the left...which will take you here: https://devcenter.heroku.com/articles/nodejs 

Install Heroku toolbelt from here: https://toolbelt.heroku.com/

Sign up via the website (no credit card required).

Login using the command line tool:

    heroku login

Create your heroku app:

    heroku create

Add redis to your app

    heroku addons:add redistogo:nano

For heroku, the `redisPort`, `redisMachine`, `redisAuth` values in `secret.js` are not used (the Redis connection in Heroku is provided by an enviornment variable `process.env.REDISTOGO_URL`

Git deploy your app:

    git push heroku master

note: **if you add lib/secret.js to your .gitignore it will not be deployed and the app will not run**. Ideally (once you get the hang of deploying this app), you'll want to move all the information in secret.js to environment variables in your production environment, for information on getting and setting environment variables for heroku use `heroku help config`

Here is what secret.js may look like after migrating everything over to environment variables:

    module.exports = {
        "consumerKey": process.env.consumerKey,
        [...]
    }

Assign a dyno to your app:

    heroku ps:scale web=1

Open the app (same as opening it in the browser):

    heroku open

And your app should be up on Heroku.

##Signing up, and deploying to Azure

First, log in to the Windows Azure dashboard at [https://manage.windowsazure.com](https://manage.windowsazure.com).

Create a new Ubuntu 14.04 virtual machine. It does not matter what tier you use, but it should be above the shared option.

Now SSH into your new instance on port 22 with PuTTY or use the SSH command:

```bash
ssh [your_username]@[your_cloud_service]
```

Now we need to install the NodeSource repository to get pre-built Node.js binaries.

Type the following commands into your console:

```bash
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get update
sudo apt-get install -y nodejs build-essentials
```

Once these commands have finished running, you can test your install by running the following commands:

```bash
node -v
npm -v
```

If both commands return a number, then you're ready to move on.

Now we need to install Redis. The latest version at this writing is 2.8.17.

Type the following commands in the terminal to install Redis:

```bash
sudo apt-get update
sudo apt-get install tcl8.5
wget http://download.redis.io/releases/redis-2.8.17.tar.gz
tar xzf redis-2.8.17.tar.gz
cd redis-2.8.17
make
make test
sudo make install
```

Redis has been built and installed, but now you must configure it, which is a very simple process.

Just type the following commands:

```bash
cd utils
./install_server.sh
```

You don't need to specify any changes, so just hit return for all of the questions.

Finally, we need to start Redis. Please note that you will need to run this command every time you reboot the computer.

```bash
sudo service redis_6379 start
```

Now, we need to start the server. Run the following commands to prepare and start your server:

```bash
npm install -g forever
sudo apt-get install git
git clone https://github.com/nhubbard/nodejs-todo.git
cd nodejs-todo
npm link forever
npm install
forever start server.js
```

Now check your cloud service domain at port 3000. You should see the app. If so, congratulations!

NOTES:

To stop your server, issue this command:

```bash
forever stop server.js
```

Your cloud service domain at port 3000 should look like this:

```
http://***************.cloudapp.net:3000
```
