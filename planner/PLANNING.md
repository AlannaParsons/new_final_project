## Stack

API


FE  
    - React
    - Next
    - Chakra UI? or bootstrap
BE
    - Next
    
DB
    - PostgreSQL 9.x

HOSTING
    - Vercel
    

## Stories

User track
    - wellness
    - fitness
    - finance
    - productivity
    - books
    - notes
    - goals
    - daily doodles
    - calendar - integrated (future dev)
    - weather
    -  to dos
    - mood tracker
templates are added by user -> avoid bloat/overwhelming
user can go to settings to add sections to journal. provide preview?

# Data
data to be stored locally. may integrate clouds backup in future to enable desktop use
consider redesign. most templates can be reused in mulitple categories

categories = {
    id: string;
    wellness:
    fitness:
    finance:
    productivity:
    books:
    notes:
    goals:
  };

user = {
    id: string;
    used categories?
    used templates
    info under each template
}

# Next Steps

