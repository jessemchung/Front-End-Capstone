# What image do you want to start building on?
FROM node:latest

# Make a folder in your image where your app's source code can live
RUN mkdir -p /src/app

# Tell your container where your app's source code will live
WORKDIR /src/app

# What source code do you what to copy, and where to put it?
COPY . /src/app

# Does your app have any dependencies that should be installed?
RUN npm install

# What port will the container talk to the outside world with once created?
EXPOSE 3000

# How do you start your app?
CMD [ "npm", "start" ]


# /home/radicaldreamer/otherFEC

# docker run -d -p 3000:3080 -v /home/radicaldreamer/otherFEC/:/src/app --name psychic_container jesstry

# this part seems necessary in some way to be linked to 3000


# docker run -d --network=host -p 3000:4000 \
#   -e "DB_DBNAME=stellar" \
#   -e "DB_PORT=5432" \
#   -e "DB_USER=postgres" \
#   -e "DB_PASS=meadowlark" \
#   -e "DB_HOST=127.0.0.1" \
#   --name jest2 --rm jesstry

# # sudo docker run -d -p 3000:3000 --name jest1 --rm jesstry