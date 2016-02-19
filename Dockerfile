FROM node

RUN npm install -g coffee-script

CMD coffee /opt/code/mechajira.coffee
