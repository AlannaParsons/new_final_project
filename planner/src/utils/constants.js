
/// will need to have specific typing here,  this is how types will be stored in db, and call to api
//extra info needed for initial page push??? ranks: settings (if per page), goals: initial goals, notes: max size?. nothing?

//consider categorizing page types. consider each "type", store in db?
//  - may lead to renaming of active pages


const rankExamples = [{type: 'ranks', blurb: 'attribute value everyday based on individualized legend. ex: weather tracking, mood tracking etc.' , img: `/images/score.jpg`},
                      {type: 'unspecifiedrank', blurb: 'not active' , img: `/images/rank.jpg`}]
const goalExamples = [{type: 'goals', blurb: 'multiple goals on page, daily use' , img: `/images/mountain.png`},
                      {type: 'singlegoal', blurb: 'not active' , img: `/images/graph.jpg`},
                      {type: 'unspecifiedgoal', blurb: 'not active' , img: `/images/arrow.jpg`}]
const noteExamples = [{type: 'notes', blurb: 'add short note everyday. ex: planning, tracking, gratitudes' , img: `/images/notepad.png`},
                      {type: 'unspecifiednote', blurb: 'not active' , img: `/images/notepad2.png`}]
const availablePages = [{id:0, type: 'ranks', img: <CalendarIcon/>, subTypes: rankExamples},
                        {id:1, type: 'goals', img: <UnlockIcon/>, subTypes: goalExamples},
                        {id:2, type: 'notes', img: <ChatIcon/>, subTypes: noteExamples}];

export { availablePages };