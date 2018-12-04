FROM node:10

RUN apt-get update -qq && apt-get install -y build-essential
RUN apt-get install -y ruby ruby-dev openssl
RUN gem install sass

RUN mkdir /src

RUN yarn global add grunt-cli

WORKDIR /src
ADD app/package.json /src/package.json
ADD app/local_modules /src/local_modules
ADD app/Gruntfile.coffee /src/Gruntfile.coffee

# -----------------------------------------------------------------------------
# ADD entrypoint
# -----------------------------------------------------------------------------
ADD 'docker/images/instant-answers/entrypoint' '/usr/local/bin/entrypoint'
RUN chmod 555        '/usr/local/bin/entrypoint'
ENTRYPOINT [ "entrypoint" ]
