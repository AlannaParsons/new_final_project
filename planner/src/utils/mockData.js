import { CalendarIcon, ChatIcon, UnlockIcon } from '@chakra-ui/icons';

const paletteData = [{color: '#016FB9', variable: 'something something'}];
//const goalData = {'exercise': [t,f,t,f,null]}
const moods = ['happy', 'good', 'okay', 'neutral', 'meh', 'moody', 'bad']
const colorLegend = ['pink', 'red', 'yellow', 'green','blue', 'purple']
// pulled as table titles from db???? or seperate table
//replace icons with example pages when possible
/// will need to have specific typing here,  this is how types will be stored in db, and call to api
//extra info needed for initial page push??? ranks: settings (if per page), goals: initial goals, notes: max size?. nothing really
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
const testUser = {id: 123, name: 'guy', password: 'password123'} 
const fakeDBData = [{id: 0, type: 'ranking', user_id : 123, dataArray : [], month: 11, year: 2024 }, 
                    {id: 1, type: 'goals', user_id : 123, dataArray : [], month: 11, year: 2024 }]
//get from db all rows associated w user... type?????
//used pages can be joined tables

export { paletteData, colorLegend, fakeDBData, availablePages};