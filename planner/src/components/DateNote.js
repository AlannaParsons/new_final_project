// returns note data for single given date
//  db data in: [{
//   id: '5f70f8be-164d-4762-bbdd-9c5c2b46d48b', 
//   note_id: null, 
//   completed: null, 
//   note: null
// }, ...]
//-------------------------------------------------------------

import {
  Box,
  Spinner,
  Tag
} from '@chakra-ui/react';

export default function DateNote({activeData}) {
  let placeholder = 'no notes'; // put inside tag? 

  return (
    <Box> 
      { activeData?.notes ? (
        <div>
          {activeData.notes.map((notePG) => {         
            return (
              <Tag key={notePG.id} variant='solid' colorScheme={notePG.completed === null ? 'red' : 'blue' }>
                { notePG.note ? notePG.note : placeholder}
              </Tag> 
            ) 
          })}
        </div>
      ) : (
        <Spinner></Spinner>
      )}
    </Box>
  );
};