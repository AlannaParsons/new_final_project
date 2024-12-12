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
LOCAL OR NOT??????

data to be stored locally. may integrate clouds backup in future to enable desktop use
consider redesign. most templates can be reused in mulitple categories. 
redesign -  UPDATE
    rankingTable = { id: 0, fk_user_id: '', title: mood}
        ranking: {date: date, rank setting idFK, ranking table FK} 
        rankseting: {id, rank int, color:string, phrase:string, rankingtable FK}
    notesTable = { id: 0, fk_user_id: '', date: date, note: string}
    goalsTable = {id: 0, fk_user_id: '', type: string}
        completion = {goaltype_id: fk individual goal, date: date }
        // may or may not include "status" attribute

user = {
    id: string;
    used categories?
    used templates
    info under each template
}

limitations -
    ranking - # of ranks will be static after creation


# Current
    - goals
        - simple version in place. make page for goals that arent daily? bigger goal specific page?
        - can change day of month to set past dates (deny access to change future dates?)
    - notes
        - make more specific? could be used for memories, gratitude journal or classic calendar
    - rating
        - make more specific? could be used for weather, mood, or period tracker. make premade layouts for specific use. use props? 
        - rank int in db data is meant to maintain dynamic nature of ledgend.. revisit when implimenting legend 
    - settings
        -cont settings. color use. add pages


# Next Steps

    - sizing not dynamic. focusing mobile design - go back to prev page, fix sizing ALL
    - day/ month/year at a glance.
    - make a 'are you sure you want to delete' pop up
    - allow for different legend types
    - how to add new pages for user
    - check double load "bug", likely strict mode, double check
    - sub header and active date will likely be moved into higher level layout, pass active date as prop to pages/components
    - start stripping unnecessary data returns from db calls
    - make subheader smaller? as dev continues, it is less important, used for month traversal only?...
    - consider goals layout, not functional ATM. make intuitive

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
            notes -> memories, dreams, reg calendar? LENGTH MAX???
        - 

    page tabs currently labeled by page type. make customizeable? give all pages titles?       

# For considereation
    - calendar component imported into header.... replace all other calendar uses??
    -year in pixels should act as a sub type page of ranking, easier to organize, all pages could have their own aggrigate
    - timezones may likely be an issue. revisit with uts eventually
    - could do component pieces instead of seperate page set up. may mess up how back end is used
    - ranks and notes similar front end. edit goals to match?
    - plan is for data to be stored locally. database set up is for showing purpose???
    - remove all user reference??? data should be held locally... will change ALL db storage usage... unsure...

# Future Dev 

- generate aesthetic palette for user
https://coolors.co/353531-ec4e20-ff9505-016fb9-000000
 https://www.reddit.com/r/gamedev/comments/1b9qvip/palette_generation_api_looking_for_an_alternative/?rdt=58257

