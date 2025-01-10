// returns rank data for single given date
//
//  db data in: [{
  // id: "6a54003e-8260-4245-b073-221ca81f6c66"
  // type: string
  // title: "mood"
  // data: { 
    // color: "purple"
    // completed: "2024-12-12T07:00:00.000Z" || null
    // fk_status: "e5da41ee-2b4d-4ba8-8475-fa42fd97fa8d"
    // phrase:  "meh"
    // rank_id: 10
  //}
//}
//-------------------------------------------------------------

import {
  Box,
  Spinner,
  Tag
} from '@chakra-ui/react';

export default function DateRank(page) {
  let placeholder = 'not ranked'

  return (
    <Box> 
      { page ? (
        <div>
          <Tag key={page.id} variant='solid' colorScheme={page.data.completed === null ? 'red' : page.data.color }>
            { page.title } 
            {' : '}
            { page.data.phrase ? page.data.phrase : placeholder}
          </Tag> 
        </div>
      ) : (
        <Spinner></Spinner>
      )}
    </Box>
  );
};