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

# Current
    - goals
        - simple version in place. make page for goals that arent daily? bigger goal specific page?
    - notes
        - make more specific? could be used for memories, gratitude journal or classic calendar
    - rating
        - make more specific? could be used for weather, mood, or period tracker. make premade layouts for specific use. use props? 
    - settings
        -cont settings. color use. add pages


# Next Steps

    - sizing not dynamic. focusing mobile design - go back to prev page, fix sizing ALL
    - day/ month/year at a glance.
    - consider database structure!!
    - make a 'are you sure you want to delete' pop up
    - year in pixels next (using rating data)
    - allow for different legend types
    - how to add new pages for user

    more pages - 
        week
        month 
        - reading
            - number of books read
            - number of pages read
            - hours listened
        - finance
            - spending per day (+ categories)
        - bingo?
        - dreams
        - chore schedule - use circular progress
        - progress tracker - reading, water drinking, saving money?
        - doodles (outsource)
        year 
        - reading 
            - https://cdn.shopify.com/s/files/1/1201/4358/files/Book_Tracker_Printable.pdf?v=1679672296
            - star rating - length - book by genre (color coded) - title on spine, star rating is ranking on shelf?
            - api for spines/covers?
        - customize bracket

    how to organize pages for user to add intuitively????
     potential grouping
        - general presentation. click into modal (or other)
            rating/trackers -> weather, period, mood (hover previews? necessary. allow for general customizeable)
            goals -> many, singular
            notes -> memories, dreams, reg calendar?
        - 
    
    data structure planning
        each page has a table w user data points?
        const fakeDBData = {'rankingTable': {id: 0, user_id : 123, dataArray : [], month: 11, year: 2024 }}

# For considereation
    - calendar component imported into header.... replace all other calendar uses??


# Future Dev 

- generate aesthetic palette for user
https://coolors.co/353531-ec4e20-ff9505-016fb9-000000
 https://www.reddit.com/r/gamedev/comments/1b9qvip/palette_generation_api_looking_for_an_alternative/?rdt=58257

