import { CalendarIcon, ChatIcon, UnlockIcon } from '@chakra-ui/icons';

const paletteData = [{color: '#016FB9', variable: 'something something'}];
//const goalData = {'exercise': [t,f,t,f,null]}
const moods = ['happy', 'good', 'okay', 'neutral', 'meh', 'moody', 'bad']
const colorLegend = ['pink', 'red', 'yellow', 'green','blue', 'purple']
// pulled as table titles from db???? or seperate table
//replace icons with example pages when possible
const availablePages = [{id:0, type: 'rating', img: <CalendarIcon/>},
                        {id:1, type: 'goals', img: <UnlockIcon/>},
                        {id:2, type: 'notes', img: <ChatIcon/>}];
const testUser = {id: 123, name: 'guy', password: 'password123'} 
const fakeDBData = [{id: 0, type: 'ranking', user_id : 123, dataArray : [], month: 11, year: 2024 }, 
                    {id: 1, type: 'goals', user_id : 123, dataArray : [], month: 11, year: 2024 }]
//get from db all rows associated w user... type?????
//used pages can be joined tables

export { paletteData, colorLegend, fakeDBData, availablePages};