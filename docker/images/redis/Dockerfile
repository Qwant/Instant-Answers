FROM redis:3.2

# -----------------------------------------------------------------------------
# ADD dependencies
# -----------------------------------------------------------------------------
ARG DEPENDENCIES=' \
    gettext-base \
    curl \
    '

ARG DEBIAN_FRONTEND=noninteractive
ADD clean    '/usr/local/bin/clean'
RUN chmod +x '/usr/local/bin/clean'

RUN apt-get update \
 && apt-get install --assume-yes --quiet --no-install-recommends $DEPENDENCIES \
 && clean

# -----------------------------------------------------------------------------
# REDIS
# -----------------------------------------------------------------------------
# Add data path
RUN ln --symbolic /data   /var/lib/redis
RUN chmod --recursive 777 /var/lib/redis/

# Add entrypoint
ADD entrypoint /usr/local/bin/docker-entrypoint.sh
RUN chmod +x   /usr/local/bin/docker-entrypoint.sh

# Add redis.conf
ADD redis.conf /usr/local/etc/redis/
CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]

# Add a healthcheck
ADD healthcheck /usr/local/bin/docker-healthcheck.sh
RUN chmod +x    /usr/local/bin/docker-healthcheck.sh
HEALTHCHECK --interval=15s --timeout=3s CMD docker-healthcheck.sh || exit 1
