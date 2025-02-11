// returns note data for single given date

// should data not be array? consistent w goals
//  db data in: [{
//   id: #, 
//   title: string
//   data: [{
  //   note_id: null, 
  //   completed: null, 
  //   note: null
  // }]
// }, ...]
//-------------------------------------------------------------

import {
  Box,
  Spinner,
  Tag
} from '@chakra-ui/react';

export default function DateNote(page) {
  let placeholder = 'no notes'; // put inside tag? 

  return (
    <Box> 
      { page ? (
        <div>
          <Tag key={page.id} variant='solid' colorScheme={page.data[0].completed === null ? 'red' : 'blue' }>
            { page.data[0].note ? page.data[0].note : placeholder}
          </Tag> 
        </div>
      ) : (
        <Spinner></Spinner>
      )}
    </Box>
  );
};