const users = [
  {
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    userName: 'phil',
    password: 'hero'
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
    userName: 'bob',
    password: 'bobloblaw'
  },
  {
    id: '126eed9c-c90c-4ef6-a4a8-fcf7408d3c66',
    userName: 'joe',
    password: '123'
  },
]; 

  // rankingTable = { id: 0, fk_user_id: '', date: date, ranking: fk to settings or color string }
  // notesTable = { id: 0, fk_user_id: '', date: date, note: string}
  // goalsTable = {id: 0, fk_user_id: '', type: string}
  //     completion = {goaltype_id: fk individual goal, date: date }
  notesPages = [
    { 
      id: '5f70f8be-164d-4762-bbdd-9c5c2b46d48b',
      fk_user: '3958dc9e-712f-4377-85e9-fec4b6a6442a', 
    }

  ]
  notes = [
    {
      id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
      fk_note_page: '5f70f8be-164d-4762-bbdd-9c5c2b46d48b',
      date: '2024-11-08',
      note: 'this thing happened'
    },
    {
      id: '364a218d-36b9-443e-bce1-27f44ba8a861',
      fk_note_page: '5f70f8be-164d-4762-bbdd-9c5c2b46d48b',
      date: '2024-11-09',
      note: 'and then this'
    },
    {
      id: 'd6ad35e4-eff8-4f7b-831b-60539940f33c',
      fk_note_page: '5f70f8be-164d-4762-bbdd-9c5c2b46d48b',
      date: '2024-11-10',
      note: 'somethign else'
    },
    {
      id: '0b05515a-0b8e-4944-99df-24c997eb3415',
      fk_note_page: '5f70f8be-164d-4762-bbdd-9c5c2b46d48b',
      date: '2024-11-11',
      note: 'a 4th thing'
    }
  ]

  goalsPages = [
    { 
      id: 'f348abf8-6a35-4f4f-a275-bf4aab188f1d',
      fk_user: '3958dc9e-712f-4377-85e9-fec4b6a6442a', 
    }

  ]

  goals = [
    {
      id: '27e6f92f-23bb-49e0-87ec-796568eaef0e', 
      fk_goal_pg: 'f348abf8-6a35-4f4f-a275-bf4aab188f1d', 
      title: 'exercise'
    },
    {
      id: 'e6631609-cec6-4967-9f9f-dcfa04e6e312', 
      fk_goal_pg: 'f348abf8-6a35-4f4f-a275-bf4aab188f1d', 
      title: 'read'
    },
    {
      id: 'cef93b6c-8770-42f6-912c-bf34e7143c7a', 
      fk_goal_pg: 'f348abf8-6a35-4f4f-a275-bf4aab188f1d', 
      title: 'dishes'
    },

  ]

  goalCompletions = [
    //dishes
    {
      goaltype_id: 'cef93b6c-8770-42f6-912c-bf34e7143c7a', 
      date: '2024-11-08',
      status: true
    },
    {
      goaltype_id: 'cef93b6c-8770-42f6-912c-bf34e7143c7a', 
      date: '2024-11-09',
      status: true
    },
    {
      goaltype_id: 'cef93b6c-8770-42f6-912c-bf34e7143c7a', 
      date: '2024-11-10',
      status: false
    },
    {
      goaltype_id: 'cef93b6c-8770-42f6-912c-bf34e7143c7a', 
      date: '2024-11-11',
      status: false
    },
    {
      goaltype_id: 'cef93b6c-8770-42f6-912c-bf34e7143c7a', 
      date: '2024-11-12',
      status: true
    },
    //read
    {
      goaltype_id: 'e6631609-cec6-4967-9f9f-dcfa04e6e312', 
      date: '2024-11-08',
      status: true
    },
    {
      goaltype_id: 'e6631609-cec6-4967-9f9f-dcfa04e6e312', 
      date: '2024-11-09',
      status: false
    },
    {
      goaltype_id: 'e6631609-cec6-4967-9f9f-dcfa04e6e312', 
      date: '2024-11-10',
      status: true
    },
    {
      goaltype_id: 'e6631609-cec6-4967-9f9f-dcfa04e6e312', 
      date: '2024-11-11',
      status: true
    },
    {
      goaltype_id: 'e6631609-cec6-4967-9f9f-dcfa04e6e312', 
      date: '2024-11-12',
      status: true
    }

  ]

  rankPages= [
    {
      id: '6a54003e-8260-4245-b073-221ca81f6c66',
      user_id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
      title: 'mood',
    },
    {
      id: '83c164ad-e7bb-4ee1-bcbc-c89345709117',
      user_id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
      title: 'mood',
    },
  ]

  rankingUnit = [
    {
      id: 0,
      rank_tbl: '6a54003e-8260-4245-b073-221ca81f6c66',
      rank_set: '76ae695f-9784-46b3-92c2-996d9af76892',
      date: '2024-11-08'
    },
    {
      id: 1,
      rank_tbl: '6a54003e-8260-4245-b073-221ca81f6c66',
      rank_set: '046247cb-398f-4b0e-954c-3c0d7e1f64b1',
      date: '2024-11-08'
    },
    {
      id: 2,
      rank_tbl: '6a54003e-8260-4245-b073-221ca81f6c66',
      rank_set: '76ae695f-9784-46b3-92c2-996d9af76892',
      date: '2024-11-08'
    },
    {
      id: 3,
      rank_tbl: '6a54003e-8260-4245-b073-221ca81f6c66',
      rank_set: '046247cb-398f-4b0e-954c-3c0d7e1f64b1',
      date: '2024-11-08'
    },
    {
      id: 4,
      rank_tbl: '6a54003e-8260-4245-b073-221ca81f6c66',
      rank_set: 'e5da41ee-2b4d-4ba8-8475-fa42fd97fa8d',
      date: '2024-11-08'
    },
    {
      id: 5,
      rank_tbl: '6a54003e-8260-4245-b073-221ca81f6c66',
      rank_set: '63a8a3ca-a9ce-4d05-91db-a010bd0e5154',
      date: '2024-11-08'
    },
    {
      id: 6,
      rank_tbl: '6a54003e-8260-4245-b073-221ca81f6c66',
      rank_set: 'e5da41ee-2b4d-4ba8-8475-fa42fd97fa8d',
      date: '2024-11-08'
    },
    {
      id: 7,
      rank_tbl: '6a54003e-8260-4245-b073-221ca81f6c66',
      rank_set: '63a8a3ca-a9ce-4d05-91db-a010bd0e5154',
      date: '2024-11-08'
    },
    {
      id: 8,
      rank_tbl: '6a54003e-8260-4245-b073-221ca81f6c66',
      rank_set: 'e5da41ee-2b4d-4ba8-8475-fa42fd97fa8d',
      date: '2024-11-08'
    },
  ]

  rankSettings= [
    {
      id: '76ae695f-9784-46b3-92c2-996d9af76892',
      rank_int: 0,
      color: 'red',
      phrase: 'bad'
    },
    {
      id: 'e5da41ee-2b4d-4ba8-8475-fa42fd97fa8d',
      rank_int: 1,
      color: 'purple',
      phrase: 'meh'
    },
    {
      id: '046247cb-398f-4b0e-954c-3c0d7e1f64b1',
      rank_int: 2,
      color: 'blue',
      phrase: 'better'
    },
    {
      id: '63a8a3ca-a9ce-4d05-91db-a010bd0e5154',
      rank_int: 3,
      color: 'green',
      phrase: 'best'
    },
  ]

      

const fakeDBData = [
  {id: 0, type: 'ranking', user_id : '3958dc9e-712f-4377-85e9-fec4b6a6442a', 
    dataArray : [], month: 11, year: 2024 }, 
  {id: 1, type: 'goals', user_id : '3958dc9e-712f-4377-85e9-fec4b6a6442a', 
    dataArray : [], month: 11, year: 2024 }
]

module.exports = {
  users, 
  notesPages, notes, 
  goalsPages, goals, goalCompletions, 
  rankPages, rankingUnit, rankSettings
};