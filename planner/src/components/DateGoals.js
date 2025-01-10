// returns activeData data for single given date. expect 1 pg in, 1 component out
//
//  db data in: [{
  // id: #, 
  // title: string,
  // data: [{
  //   completed: "2024-12-12T07:00:00.000Z" || null
  //   goal_id: #
  //   title: string}, ...]
  // }, ...]
//
//-------------------------------------------------------------

import {
  Box,
  Spinner,
  Tag
} from '@chakra-ui/react';

export default function DateGoals(page) {
  let placeholder = 'add goals'

  return (
    <Box> 
      { page ? (
        <div>   
          {page.data.map((goal) => {
            return <Tag key={goal.goal_id} variant='solid' colorScheme={goal.completed === null ? 'red' : 'blue' }>
              {goal.title ? goal.title : placeholder}
            </Tag> 
          })}
        </div>
      ) : (
        <Spinner></Spinner>
      )}
    </Box>
  );
};